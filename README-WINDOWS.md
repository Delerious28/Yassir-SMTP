# Windows setup guide

## Requirements
- Node.js 20+
- pnpm 9 (`npm i -g pnpm@9`)
- Docker Desktop with WSL2 backend
- PowerShell 7+

## Quickstart
1. Duplicate `.env.example` to `.env` and set `DATABASE_URL`, `REDIS_URL`, `MASTER_KEY` (32-byte base64), and `JWT_SECRET`.
2. Launch Postgres + Redis:
   ```powershell
   docker compose -f infra/compose.deps.yml up -d
   ```
3. Apply migrations and seed admin user:
   ```powershell
   pnpm run db:migrate
   pnpm run db:seed
   ```
4. Run everything locally (web/api/workers):
   ```powershell
   pnpm run dev
   ```

### All-in-Docker (optional)
```powershell
docker compose -f infra/compose.full.yml up --build -d
```

## Local development (pnpm)
```powershell
# install deps
pnpm install

# start postgres/redis
docker compose -f infra/compose.deps.yml up -d

# migrate + seed
pnpm run db:migrate
pnpm run db:seed

# run web/api/worker together
pnpm run dev

# stop infra when done
pnpm run deps:down
```
