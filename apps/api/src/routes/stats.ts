import { FastifyPluginAsync } from 'fastify';

export const statsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    if (req.routerPath?.startsWith('/api/auth')) return;
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  app.get('/stats', async () => {
    const [sentToday, queued, replies, bounces] = await Promise.all([
      app.prisma.sendJob.count({ where: { status: 'sent', updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      app.prisma.sendJob.count({ where: { status: 'queued' } }),
      app.prisma.lead.count({ where: { consentStatus: 'replied' } }),
      app.prisma.lead.count({ where: { consentStatus: 'bounced' } })
    ]);
    return { sentToday, queued, replies, bounces };
  });
};
