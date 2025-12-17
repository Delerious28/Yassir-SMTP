import { Queue, Worker, JobsOptions } from 'bullmq';
import { SEND_QUEUE, JOB_NAMES, computeJitterDelay, decryptSecret } from '@yassir/shared';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
const prisma = new PrismaClient();
const queue = new Queue(SEND_QUEUE, { connection });

export function startSendWorker() {
  new Worker(
    SEND_QUEUE,
    async (job) => {
      if (job.name !== JOB_NAMES.SEND_EMAIL) return;
      const { sendJobId } = job.data as { sendJobId: string };
      const sendJob = await prisma.sendJob.findUnique({
        where: { id: sendJobId },
        include: { campaign: true, lead: true, account: true }
      });
      if (!sendJob) return;
      const { campaign, lead, account } = sendJob;
      if (!campaign.active || !account.enabled) {
        await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: 'cancelled', lastError: 'inactive' } });
        return;
      }
      if (lead.consentStatus !== 'opt_in') {
        await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: 'cancelled', lastError: 'consent_required' } });
        return;
      }
      const sentToday = await prisma.sendJob.count({
        where: {
          accountId: account.id,
          status: 'sent',
          updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      });
      if (sentToday >= account.dailySendLimit) {
        throw new Error('Daily limit reached');
      }
      const campaignSent = await prisma.sendJob.count({
        where: {
          campaignId: campaign.id,
          status: 'sent',
          updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      });
      if (campaignSent >= campaign.campaignDailyLimit) {
        throw new Error('Campaign limit reached');
      }

      const transporter = nodemailer.createTransport({
        host: account.smtpHost,
        port: account.smtpPort,
        secure: account.smtpSecure,
        auth: { user: account.smtpUser, pass: decryptSecret(account.smtpPassword) }
      });
      const unsubscribeLink = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(lead.email)}`;
      const message = {
        from: account.smtpUser,
        to: lead.email,
        subject: `Step ${sendJob.stepNumber}`,
        html: `<div>${sendJob.stepNumber} - Template Body<br/><a href="${unsubscribeLink}">Unsubscribe</a></div>`,
        headers: {
          'List-Unsubscribe': `<${unsubscribeLink}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      };
      const info = await transporter.sendMail(message);
      await prisma.sendJob.update({ where: { id: sendJob.id }, data: { status: 'sent', messageId: info.messageId, updatedAt: new Date() } });
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
