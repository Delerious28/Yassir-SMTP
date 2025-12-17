import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import { emailAccountSchema, leadSchema, campaignSchema, sequenceStepSchema, loginSchema } from '@yassir/shared';
import { authRoutes } from './routes/auth.js';
import { emailAccountRoutes } from './routes/email-accounts.js';
import { leadRoutes } from './routes/leads.js';
import { campaignRoutes } from './routes/campaigns.js';
import { uniboxRoutes } from './routes/unibox.js';
import { statsRoutes } from './routes/stats.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = fastify({ logger: true });

await app.register(cors, { origin: true });
app.register(jwt, { secret: process.env.JWT_SECRET || 'devsecret' });

app.decorate('prisma', prisma);
app.decorate('schemas', {
  emailAccountSchema,
  leadSchema,
  campaignSchema,
  sequenceStepSchema,
  loginSchema
});

app.addHook('onClose', async () => {
  await prisma.$disconnect();
});

app.register(authRoutes, { prefix: '/api/auth' });
app.register(emailAccountRoutes, { prefix: '/api/email-accounts' });
app.register(leadRoutes, { prefix: '/api/leads' });
app.register(campaignRoutes, { prefix: '/api/campaigns' });
app.register(uniboxRoutes, { prefix: '/api/unibox' });
app.register(statsRoutes, { prefix: '/api' });

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '0.0.0.0';
app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    schemas: {
      emailAccountSchema: typeof emailAccountSchema;
      leadSchema: typeof leadSchema;
      campaignSchema: typeof campaignSchema;
      sequenceStepSchema: typeof sequenceStepSchema;
      loginSchema: typeof loginSchema;
    };
  }
}
