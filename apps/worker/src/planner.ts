import { Queue, Worker } from 'bullmq';
import { PLANNER_QUEUE, JOB_NAMES, SEND_QUEUE } from '@yassir/shared';
import { PrismaClient } from '@prisma/client';
import { enqueueSendJob, computeSchedule } from './send-worker.js';

const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
const prisma = new PrismaClient();
const plannerQueue = new Queue(PLANNER_QUEUE, { connection });

export function startPlanner() {
  new Worker(
    PLANNER_QUEUE,
    async (job) => {
      if (job.name !== JOB_NAMES.PLAN_STEPS) return;
      const { campaignId } = job.data as { campaignId: string };
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { steps: { orderBy: { stepNumber: 'asc' } }, accounts: true, leads: true }
      });
      if (!campaign || !campaign.active) return;
      for (const leadLink of campaign.leads) {
        const lead = await prisma.lead.findUnique({ where: { id: leadLink.leadId } });
        if (!lead || lead.consentStatus !== 'opt_in') continue;
        const stepNumber = leadLink.stepNumber || 1;
        const step = campaign.steps.find((s) => s.stepNumber === stepNumber);
        if (!step) continue;
        const accountId = campaign.accounts[0]?.accountId;
        if (!accountId) continue;
        const delay = computeSchedule(7, 5);
        const sendJob = await prisma.sendJob.create({
          data: {
            campaignId: campaign.id,
            leadId: lead.id,
            accountId,
            stepNumber,
            scheduledAt: new Date(Date.now() + delay),
            status: 'queued'
          }
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
