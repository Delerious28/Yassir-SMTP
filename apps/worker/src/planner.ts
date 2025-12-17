import { Queue, Worker, QueueScheduler } from 'bullmq';
import { PLANNER_QUEUE, JOB_NAMES, SEND_QUEUE, computeJitterDelay } from '@yassir/shared';
import { PrismaClient, ConsentStatus, LeadState } from '@prisma/client';
import { enqueueSendJob } from './send-worker.js';

const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
const prisma = new PrismaClient();
const plannerQueue = new Queue(PLANNER_QUEUE, { connection });
new QueueScheduler(PLANNER_QUEUE, { connection });
new QueueScheduler(SEND_QUEUE, { connection });

function waitMsFromStep(stepWaitDays: number, lastSentAt?: Date | null) {
  const base = stepWaitDays * 24 * 60 * 60 * 1000;
  if (!lastSentAt) return base;
  const nextAvailable = lastSentAt.getTime() + base;
  return Math.max(0, nextAvailable - Date.now());
}

async function pickAccount(campaignId: string, accountIds: string[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const counts = await Promise.all(
    accountIds.map(async (accountId) => {
      const sentToday = await prisma.sendJob.count({
        where: { accountId, status: 'sent', updatedAt: { gte: today } }
      });
      return { accountId, sentToday };
    })
  );
  const sorted = counts.sort((a, b) => a.sentToday - b.sentToday);
  return sorted[0]?.accountId;
}

export function startPlanner() {
  new Worker(
    PLANNER_QUEUE,
    async (job) => {
      if (job.name !== JOB_NAMES.PLAN_STEPS) return;
      const { campaignId } = job.data as { campaignId: string };
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          steps: { orderBy: { stepNumber: 'asc' } },
          accounts: { include: { account: true } },
          leads: { include: { lead: true } }
        }
      });
      if (!campaign || !campaign.active) return;
      if (!campaign.steps.length || !campaign.accounts.length) return;

      for (const leadLink of campaign.leads) {
        if (!leadLink.lead || leadLink.lead.consentStatus !== ConsentStatus.opt_in) continue;
        const suppressed = await prisma.suppressionEntry.findUnique({ where: { email: leadLink.lead.email } });
        if (suppressed) continue;
        const nextStep = campaign.steps.find((s) => s.stepNumber === leadLink.stepNumber);
        if (!nextStep) continue;
        const accountId = await pickAccount(
          campaign.id,
          campaign.accounts.filter((c) => c.account.enabled).map((c) => c.accountId)
        );
        if (!accountId) continue;
        const account = campaign.accounts.find((c) => c.accountId === accountId)!.account;
        const delay = waitMsFromStep(nextStep.waitDaysAfterPrev, leadLink.lastSentAt) +
          computeJitterDelay(account.minTimeGapMinutes, account.jitterMinutes);

        const sendJob = await prisma.sendJob.create({
          data: {
            campaignId: campaign.id,
            leadId: leadLink.leadId,
            accountId,
            stepNumber: nextStep.stepNumber,
            scheduledAt: new Date(Date.now() + delay),
            status: 'queued'
          }
        });
        await prisma.campaignLead.update({
          where: { campaignId_leadId: { campaignId: campaign.id, leadId: leadLink.leadId } },
          data: { state: LeadState.queued, nextSendAt: new Date(Date.now() + delay) }
        });
        await enqueueSendJob(sendJob.id, delay);
      }
    },
    { connection }
  );
}

export async function scheduleCampaign(campaignId: string) {
  await plannerQueue.add(JOB_NAMES.PLAN_STEPS, { campaignId });
}
