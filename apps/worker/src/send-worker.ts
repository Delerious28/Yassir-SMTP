import { Queue, Worker, QueueScheduler, JobsOptions } from 'bullmq';
import { SEND_QUEUE, JOB_NAMES, computeJitterDelay } from '@yassir/shared';
import { PrismaClient, ConsentStatus, JobStatus, LeadState } from '@prisma/client';
import nodemailer from 'nodemailer';
import { decryptSecret } from '@yassir/shared';

const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
const prisma = new PrismaClient();
const queue = new Queue(SEND_QUEUE, { connection });
new QueueScheduler(SEND_QUEUE, { connection });

function renderTemplate(template: string, lead: { firstName?: string | null; lastName?: string | null; company?: string | null }) {
  return template
    .replace(/{{\s*first_name\s*}}/gi, lead.firstName || '')
    .replace(/{{\s*last_name\s*}}/gi, lead.lastName || '')
    .replace(/{{\s*company\s*}}/gi, lead.company || '');
}

async function scheduleNextStep(
  campaignId: string,
  leadId: string,
  currentStepNumber: number,
  accountId: string
) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { steps: { orderBy: { stepNumber: 'asc' } }, accounts: { include: { account: true } } }
  });
  if (!campaign || !campaign.active) return;
  const nextStep = campaign.steps.find((s) => s.stepNumber === currentStepNumber + 1);
  if (!nextStep) {
    await prisma.campaignLead.update({
      where: { campaignId_leadId: { campaignId, leadId } },
      data: { state: LeadState.sent, nextSendAt: null }
    });
    return;
  }
  const account = campaign.accounts.find((a) => a.accountId === accountId)?.account || campaign.accounts[0]?.account;
  if (!account) return;
  const delay =
    nextStep.waitDaysAfterPrev * 24 * 60 * 60 * 1000 + computeJitterDelay(account.minTimeGapMinutes, account.jitterMinutes);
  const sendJob = await prisma.sendJob.create({
    data: {
      campaignId,
      leadId,
      accountId: account.id,
      stepNumber: nextStep.stepNumber,
      scheduledAt: new Date(Date.now() + delay),
      status: JobStatus.queued
    }
  });
  await prisma.campaignLead.update({
    where: { campaignId_leadId: { campaignId, leadId } },
    data: { state: LeadState.queued, stepNumber: nextStep.stepNumber, nextSendAt: new Date(Date.now() + delay) }
  });
  await enqueueSendJob(sendJob.id, delay);
}

export function startSendWorker() {
  new Worker(
    SEND_QUEUE,
    async (job) => {
      if (job.name !== JOB_NAMES.SEND_EMAIL) return;
      const { sendJobId } = job.data as { sendJobId: string };
      const sendJob = await prisma.sendJob.findUnique({
        where: { id: sendJobId },
        include: { campaign: { include: { steps: true } }, lead: true, account: true }
      });
      if (!sendJob) return;
      const { campaign, lead, account } = sendJob;

      if (!campaign.active || !account.enabled) {
        await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: JobStatus.cancelled, lastError: 'inactive' } });
        return;
      }
      if ([ConsentStatus.bounced, ConsentStatus.complaint, ConsentStatus.unsubscribed].includes(lead.consentStatus)) {
        await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: JobStatus.cancelled, lastError: 'suppressed' } });
        return;
      }
      if (lead.consentStatus !== ConsentStatus.opt_in) {
        await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: JobStatus.cancelled, lastError: 'consent_required' } });
        return;
      }
      const suppressed = await prisma.suppressionEntry.findUnique({ where: { email: lead.email } });
      if (suppressed) {
        await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: JobStatus.cancelled, lastError: 'suppressed' } });
        return;
      }

      const sentToday = await prisma.sendJob.count({
        where: {
          accountId: account.id,
          status: JobStatus.sent,
          updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      });
      if (sentToday >= account.dailySendLimit) {
        throw new Error('Daily limit reached');
      }
      const campaignSent = await prisma.sendJob.count({
        where: {
          campaignId: campaign.id,
          status: JobStatus.sent,
          updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      });
      if (campaignSent >= campaign.campaignDailyLimit) {
        throw new Error('Campaign limit reached');
      }

      const step = campaign.steps.find((s) => s.stepNumber === sendJob.stepNumber);
      if (!step) {
        await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: JobStatus.cancelled, lastError: 'missing_step' } });
        return;
      }

      await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: JobStatus.sending } });
      const transporter = nodemailer.createTransport({
        host: account.smtpHost,
        port: account.smtpPort,
        secure: account.smtpSecure,
        auth: { user: account.smtpUser, pass: decryptSecret(account.smtpPassword) }
      });
      const unsubscribeLink = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(
        lead.email
      )}`;
      const subject = renderTemplate(step.subjectTemplate, lead);
      const body = renderTemplate(step.bodyTemplate, lead);
      const message = {
        from: account.smtpUser,
        to: lead.email,
        subject,
        html: `${body}<br/><a href="${unsubscribeLink}">Unsubscribe</a>`,
        headers: {
          'List-Unsubscribe': `<${unsubscribeLink}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      };
      const info = await transporter.sendMail(message);
      await prisma.sendJob.update({
        where: { id: sendJob.id },
        data: { status: JobStatus.sent, messageId: info.messageId, updatedAt: new Date() }
      });
      await prisma.message.create({
        data: {
          direction: 'outbound',
          campaignId: campaign.id,
          outboundLeadId: lead.id,
          accountId: account.id,
          subject: message.subject,
          body: message.html,
          messageId: info.messageId,
          sentAt: new Date()
        }
      });
      await prisma.campaignLead.update({
        where: { campaignId_leadId: { campaignId: campaign.id, leadId: lead.id } },
        data: { lastSentAt: new Date(), stepNumber: sendJob.stepNumber }
      });

      await scheduleNextStep(campaign.id, lead.id, sendJob.stepNumber, account.id);
    },
    { connection }
  );
}

export async function enqueueSendJob(sendJobId: string, delayMs: number) {
  const opts: JobsOptions = { delay: delayMs, attempts: 5, backoff: { type: 'exponential', delay: 5000 } };
  await queue.add(JOB_NAMES.SEND_EMAIL, { sendJobId }, opts);
}

export function computeSchedule(minGap: number, jitter: number) {
  return computeJitterDelay(minGap, jitter);
}
