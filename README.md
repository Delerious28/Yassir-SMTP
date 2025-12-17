# Yassir SMTP Campaign

Self-hosted email campaign platform using SMTP for outbound and IMAP for inbound. Built with Node.js/TypeScript, Fastify API, Prisma/Postgres, Redis/BullMQ workers, and Next.js frontend. Only opt-in/billing-safe outreach is supported.

## Getting started
1. Copy `.env.example` to `.env` and set secrets (use a 32-byte base64 MASTER_KEY).
2. Start dependencies (Postgres + Redis):
   ```powershell
   npm run deps:up
   ```
3. Run migrations and seed admin user:
   ```powershell
   npm run db:migrate
   npm run db:seed
   ```
4. Start dev servers (API, web, workers):
   ```powershell
   npm run dev
   ```

See [README-WINDOWS.md](README-WINDOWS.md) for Windows-focused steps.
