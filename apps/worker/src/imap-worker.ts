import { Worker } from 'bullmq';
import { IMAP_QUEUE, JOB_NAMES, decryptSecret } from '@yassir/shared';
import { PrismaClient } from '@prisma/client';
import { ImapFlow } from 'imapflow';

const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
const prisma = new PrismaClient();

export function startImapWorker() {
  new Worker(
    IMAP_QUEUE,
    async (job) => {
      if (job.name !== JOB_NAMES.SYNC_IMAP) return;
      const { accountId } = job.data as { accountId: string };
      const account = await prisma.emailAccount.findUnique({ where: { id: accountId } });
      if (!account) return;
      const client = new ImapFlow({
        host: account.imapHost,
        port: account.imapPort,
        secure: account.imapSecure,
        auth: { user: account.imapUser, pass: decryptSecret(account.imapPassword) }
      });
      await client.connect();
      await client.mailboxOpen('INBOX');
      for await (const message of client.fetch('1:*', { envelope: true, uid: true, source: true, headers: true })) {
        const from = message.envelope?.from?.[0]?.address || '';
        const inReplyTo = message.envelope?.inReplyTo || undefined;
        const subject = message.envelope?.subject || '';
        await prisma.message.upsert({
          where: { messageId: message.envelope?.messageId || `${accountId}-${message.uid}` },
          update: {},
          create: {
            direction: 'inbound',
            accountId,
            subject,
            body: message.source?.toString() || '',
            messageId: message.envelope?.messageId || `${accountId}-${message.uid}`,
            inReplyTo,
            receivedAt: new Date(),
            rawHeaders: message.headers
          }
        });
        if (inReplyTo) {
          const outbound = await prisma.message.findFirst({ where: { messageId: inReplyTo } });
          if (outbound?.outboundLeadId) {
            await prisma.lead.update({ where: { id: outbound.outboundLeadId }, data: { consentStatus: 'replied' } });
            await prisma.sendJob.updateMany({ where: { leadId: outbound.outboundLeadId, campaignId: outbound.campaignId, status: 'queued' }, data: { status: 'cancelled' } });
          }
        }
      }
      await client.logout();
    },
    { connection, concurrency: 1 }
  );
}
