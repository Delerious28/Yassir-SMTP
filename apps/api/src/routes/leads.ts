import { FastifyPluginAsync } from 'fastify';
import { leadSchema, normalizeEmail, guessProvider } from '@yassir/shared';
import { z } from 'zod';

const importSchema = z.object({
  leads: z.array(z.string()).min(1)
});

const unsubscribeSchema = z.object({
  email: z.string().email()
});

export const leadRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  app.get('/', async () => {
    return app.prisma.lead.findMany({});
  });

  app.post('/', async (request, reply) => {
    const payload = leadSchema.parse(request.body);
    const email = normalizeEmail(payload.email);
    const providerMatch = await guessProvider(email);
    const lead = await app.prisma.lead.upsert({
      where: { email },
      update: { ...payload, email, providerMatch },
      create: { ...payload, email, providerMatch }
    });
    return reply.code(201).send(lead);
  });

  app.post('/import/paste', async (request, reply) => {
    const body = importSchema.parse(request.body);
    const emails = body.leads.flatMap((raw) => raw.split(/[,\n]/)).map(normalizeEmail).filter(Boolean);
    const unique = Array.from(new Set(emails));
    const created: string[] = [];
    for (const email of unique) {
      const providerMatch = await guessProvider(email);
      await app.prisma.lead.upsert({
        where: { email },
        update: { email, providerMatch },
        create: { email, providerMatch }
      });
      created.push(email);
    }
    return reply.send({ count: created.length });
  });

  app.delete('/:id', async (request) => {
    const { id } = request.params as { id: string };
    await app.prisma.lead.delete({ where: { id } });
    return { deleted: true };
  });

  app.post('/unsubscribe', async (request, reply) => {
    const { email } = unsubscribeSchema.parse(request.body);
    const normalized = normalizeEmail(email);
    await app.prisma.lead.upsert({
      where: { email: normalized },
      update: { consentStatus: 'unsubscribed', consentSource: 'unsubscribe_link', consentTimestamp: new Date() },
      create: {
        email: normalized,
        consentStatus: 'unsubscribed',
        consentSource: 'unsubscribe_link',
        consentTimestamp: new Date(),
        tags: []
      }
    });
    await app.prisma.suppressionEntry.upsert({
      where: { email: normalized },
      update: { reason: 'unsubscribed' },
      create: { email: normalized, reason: 'unsubscribed' }
    });
    return reply.send({ unsubscribed: true });
  });
};
