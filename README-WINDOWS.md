# Windows Setup Guide

## Requirements
- Docker Desktop with WSL2 backend
- PowerShell 7+ (for local development only)
- Node.js 24+ and pnpm 9+ (for local development only)

## 🚀 Quick Start (Docker - Recommended)

**For clients/production use - Zero configuration required:**

1. Ensure Docker Desktop is running
2. Run the application:
   ```powershell
   docker compose -f infra/compose.full.yml up -d
   ```
3. Access the application at http://localhost:3000

**To stop:**
```powershell
docker compose -f infra/compose.full.yml down
```

That's it! All services (Frontend, API, Workers, Database, Redis) run in Docker containers.

## 📋 What's Included

The Docker setup includes:
- **Frontend (Next.js)**: Port 3000
- **API (Fastify)**: Port 3001  
- **Workers (BullMQ)**: Port 3002
- **PostgreSQL 16**: Port 5432
- **Redis 7**: Port 6379

All dependencies are pre-installed and configured. No need to install Node.js, pnpm, or run migrations manually.

## 🛠️ Local Development (Without Docker)

If you need to modify code and see changes instantly:

1. Install dependencies:
   ```powershell
   pnpm install
   ```

2. Set up environment variables - Copy `.env.example` to `.env`:
   ```powershell
   cp .env.example .env
   ```

3. Launch dependencies (Postgres + Redis) only:
   ```powershell
   pnpm run deps:up
   ```

4. Apply migrations and seed admin user:
   ```powershell
   pnpm run db:migrate
   pnpm run db:seed
   ```

5. Run dev servers locally (with hot reload):
   ```powershell
   pnpm run dev
   ```

## 🔧 Technical Details

### Docker Setup Changes Made

1. **Package Manager**: Switched from npm to pnpm for better workspace protocol support on Windows
2. **Dependencies**: 
   - Fixed `fastify-zod` version (2.0.0 → 1.4.0)
   - Removed deprecated `QueueScheduler` from BullMQ 5.x
   - Fixed Prisma `ConsentStatus` enum imports (uses string literals instead)
3. **Dockerfile Optimizations**:
   - Single-stage Alpine-based Node.js 24 build
   - Installed OpenSSL for Prisma engine compatibility
   - Used `--shamefully-hoist` for proper module resolution
   - Symlinked Prisma client for correct path resolution
4. **Docker Compose**:
   - Removed obsolete `version` field
   - Added health checks for Postgres and Redis
   - Removed volume mounts that were overwriting built node_modules
   - All services start in correct dependency order

### Troubleshooting

**If services don't start:**
```powershell
# Rebuild from scratch
docker compose -f infra/compose.full.yml down
docker compose -f infra/compose.full.yml up --build
```

**View logs:**
```powershell
# All services
docker compose -f infra/compose.full.yml logs

# Specific service
docker compose -f infra/compose.full.yml logs app
docker compose -f infra/compose.full.yml logs postgres
docker compose -f infra/compose.full.yml logs redis
```

**Check running containers:**
```powershell
docker ps
```
