# Yassir SMTP Campaign

Self-hosted email campaign platform using SMTP for outbound and IMAP for inbound. Built with Node.js/TypeScript, Fastify API, Prisma/Postgres, Redis/BullMQ workers, and Next.js frontend. Only opt-in/billing-safe outreach is supported.

## 🚀 Quick Start with Docker (Recommended)

**One command to run everything:**

```bash
docker compose -f infra/compose.full.yml up -d
```

Access the application at **http://localhost:3000**

**To stop:**
```bash
docker compose -f infra/compose.full.yml down
```

No installation, no configuration, no terminal wizardry needed. Just Docker.

## 📦 What's Running

- **Frontend**: Next.js 14 on port 3000
- **API**: Fastify 4 on port 3001
- **Workers**: BullMQ background jobs on port 3002
- **Database**: PostgreSQL 16 on port 5432
- **Cache**: Redis 7 on port 6379

All services run in containers with automatic health checks and dependency management.

## 🛠️ Local Development (Advanced)

For developers who want hot reload and code changes:

1. Install pnpm globally:
   ```bash
   npm install -g pnpm@9
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env` and set secrets (use a 32-byte base64 MASTER_KEY):
   ```bash
   cp .env.example .env
   ```

4. Start dependencies only (Postgres + Redis):
   ```bash
   pnpm run deps:up
   ```

5. Run migrations and seed admin user:
   ```bash
   pnpm run db:migrate
   pnpm run db:seed
   ```

6. Start dev servers (API, web, workers):
   ```bash
   pnpm run dev
   ```

## 📖 Platform-Specific Guides

- **Windows Users**: See [README-WINDOWS.md](README-WINDOWS.md) for detailed Windows setup and troubleshooting
- **Linux/Mac**: The Docker setup works identically on all platforms

## 🔧 Technical Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, TanStack Query
- **Backend**: Fastify 4, Prisma ORM, PostgreSQL 16
- **Workers**: BullMQ 5, Redis 7, IMAP/SMTP clients
- **DevOps**: Docker Compose, Alpine Linux, pnpm workspaces
