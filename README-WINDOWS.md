# Windows setup guide

## Requirements
- Node.js 20+
- Docker Desktop with WSL2 backend
- PowerShell 7+

## Quickstart
1. Duplicate `.env.example` to `.env` and set `DATABASE_URL`, `REDIS_URL`, `MASTER_KEY` (32-byte base64), and `JWT_SECRET`.
2. Launch Postgres + Redis:
   ```powershell
   npm run deps:up
   ```
3. Apply migrations and seed admin user:
   ```powershell
   npm run db:migrate
   npm run db:seed
   ```
4. Run everything locally (web/api/workers):
   ```powershell
   npm run dev
   ```

### All-in-Docker (optional)
```powershell
docker compose -f infra/compose.full.yml up --build
```
