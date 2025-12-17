import { FastifyPluginAsync } from 'fastify';
import { campaignSchema, sequenceStepSchema } from '@yassir/shared';
import { z } from 'zod';
import { PLANNER_QUEUE, JOB_NAMES } from '@yassir/shared';
import { Queue } from 'bullmq';

const idParam = z.object({ id: z.string() });
const attachLeadsSchema = z.object({ leadIds: z.array(z.string()).min(1) });

export const campaignRoutes: FastifyPluginAsync = async (app) => {
  const plannerQueue = new Queue(PLANNER_QUEUE, { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } });

  app.addHook('preHandler', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  app.get('/', async () => {
    return app.prisma.campaign.findMany({ include: { accounts: true, steps: true } });
  });

  app.get('/:id', async (request) => {
    const { id } = idParam.parse(request.params);
    return app.prisma.campaign.findUnique({
      where: { id },
      include: { leads: { include: { lead: true } }, accounts: true, steps: true }
    });
  });

  app.post('/', async (request, reply) => {
    const payload = campaignSchema.parse(request.body);
    const campaign = await app.prisma.campaign.create({ data: payload });
    return reply.code(201).send(campaign);
  });

  app.put('/:id', async (request, reply) => {
    const { id } = idParam.parse(request.params);
    const payload = campaignSchema.partial().parse(request.body);
    await app.prisma.campaign.update({ where: { id }, data: payload });
    return { updated: true };
  });

  app.delete('/:id', async (request) => {
    const { id } = idParam.parse(request.params);
    await app.prisma.campaign.delete({ where: { id } });
    return { deleted: true };
  });

  app.get('/:id/sequence-steps', async (request) => {
    const { id } = idParam.parse(request.params);
    return app.prisma.sequenceStep.findMany({ where: { campaignId: id }, orderBy: { stepNumber: 'asc' } });
  });

  app.post('/:id/sequence-steps', async (request, reply) => {
    const { id } = idParam.parse(request.params);
    const payload = sequenceStepSchema.parse(request.body);
    const step = await app.prisma.sequenceStep.upsert({
      where: { campaignId_stepNumber: { campaignId: id, stepNumber: payload.stepNumber } },
      update: payload,
      create: { ...payload, campaignId: id }
    });
    return reply.code(201).send(step);
  });

  app.post('/:id/leads', async (request, reply) => {
    const { id } = idParam.parse(request.params);
    const { leadIds } = attachLeadsSchema.parse(request.body);
    const campaign = await app.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return reply.code(404).send({ message: 'Campaign not found' });
    const results = await Promise.all(
      leadIds.map((leadId) =>
        app.prisma.campaignLead.upsert({
          where: { campaignId_leadId: { campaignId: id, leadId } },
          update: {},
          create: { campaignId: id, leadId }
        })
      )
    );
    return reply.code(201).send({ attached: results.length });
  });

  app.post('/:id/start', async (request, reply) => {
    const { id } = idParam.parse(request.params);
    const campaign = await app.prisma.campaign.update({ where: { id }, data: { active: true } });
    await plannerQueue.add(JOB_NAMES.PLAN_STEPS, { campaignId: id });
    return reply.send({ started: true, campaign });
  });

  app.post('/:id/stop', async (request, reply) => {
    const { id } = idParam.parse(request.params);
    const campaign = await app.prisma.campaign.update({ where: { id }, data: { active: false } });
    return reply.send({ stopped: true, campaign });
  });
};
