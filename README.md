# Yassir SMTP Campaign

Self-hosted email campaign platform using SMTP for outbound and IMAP for inbound. Built with Node.js/TypeScript, Fastify API, Prisma/Postgres, Redis/BullMQ workers, and Next.js frontend. Only opt-in/billing-safe outreach is supported.

## Quickstart (Docker, recommended)
1. Ensure Docker Desktop is running.
2. (Optional) Copy environment defaults: `Copy-Item .env.example .env` and adjust secrets if needed.
3. Build and start everything: `docker compose -f infra/compose.full.yml up --build -d`
4. Wait for Postgres/Redis health checks, then open http://localhost:3000 (web) or http://localhost:3001 (API).
5. Tail logs if needed: `docker compose -f infra/compose.full.yml logs -f api worker web`
6. Stop services: `docker compose -f infra/compose.full.yml down` (add `--volumes` to reset databases).

## Local development (pnpm)
1. Install pnpm 9: `npm i -g pnpm@9`
2. Install deps: `pnpm install`
3. Start infra: `pnpm run deps:up`
4. Migrate and seed: `pnpm run db:migrate` then `pnpm run db:seed`
5. Run all dev services: `pnpm run dev`
6. Stop infra when done: `pnpm run deps:down`

See [README-WINDOWS.md](README-WINDOWS.md) for Windows-focused steps.
