import { FastifyPluginAsync } from 'fastify';
import { emailAccountSchema } from '@yassir/shared';
import { encryptSecret, decryptSecret } from '@yassir/shared';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';

export const emailAccountRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  app.get('/', async () => {
    const accounts = await app.prisma.emailAccount.findMany();
    return accounts.map((a) => ({
      ...a,
      smtpPassword: undefined,
      imapPassword: undefined
    }));
  });

  app.post('/', async (request, reply) => {
    const payload = emailAccountSchema.parse(request.body);
    const record = await app.prisma.emailAccount.create({
      data: {
        ...payload,
        smtpPassword: encryptSecret(payload.smtpPassword),
        imapPassword: encryptSecret(payload.imapPassword)
      }
    });
    return reply.code(201).send({ id: record.id });
  });

  app.put('/:id', async (request, reply) => {
    const payload = emailAccountSchema.partial().parse(request.body);
    const { id } = request.params as { id: string };
    const data: any = { ...payload };
    if (payload.smtpPassword) data.smtpPassword = encryptSecret(payload.smtpPassword);
    if (payload.imapPassword) data.imapPassword = encryptSecret(payload.imapPassword);
    await app.prisma.emailAccount.update({ where: { id }, data });
    return { updated: true };
  });

  app.delete('/:id', async (request) => {
    const { id } = request.params as { id: string };
    await app.prisma.emailAccount.delete({ where: { id } });
    return { deleted: true };
  });

  app.post('/test', async (request, reply) => {
    const payload = emailAccountSchema.parse(request.body);
    const smtpTransport = nodemailer.createTransport({
      host: payload.smtpHost,
      port: payload.smtpPort,
      secure: payload.smtpSecure,
      auth: { user: payload.smtpUser, pass: payload.smtpPassword }
    });
    await smtpTransport.verify();

    const imapClient = new ImapFlow({
      host: payload.imapHost,
      port: payload.imapPort,
      secure: payload.imapSecure,
      auth: { user: payload.imapUser, pass: payload.imapPassword }
    });
    await imapClient.connect();
    await imapClient.list();
    await imapClient.mailboxOpen('INBOX');
    await imapClient.logout();

    return reply.send({ ok: true });
  });
};
