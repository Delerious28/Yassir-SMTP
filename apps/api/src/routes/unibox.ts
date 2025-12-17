import { FastifyPluginAsync } from 'fastify';

export const uniboxRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  app.get('/threads', async () => {
    const messages = await app.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { lead: true, inboundLead: true }
    });
    return messages;
  });

  app.get('/messages', async (request) => {
    const { leadId } = request.query as { leadId?: string };
    return app.prisma.message.findMany({
      where: leadId
        ? { OR: [{ outboundLeadId: leadId }, { inboundLeadId: leadId }] }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: { lead: true, inboundLead: true }
    });
  });
};
