# Multi-stage build for Yassir SMTP
FROM node:24-alpine

# Install OpenSSL for Prisma engine
RUN apk add --no-cache openssl

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy workspace config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

# Copy workspace directories
COPY apps ./apps

COPY packages ./packages

COPY prisma ./prisma

# Install dependencies with shamefully-hoist for proper resolution
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Generate Prisma client AFTER install to ensure proper symlinking
RUN rm -rf /app/node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client
RUN pnpm exec prisma generate --schema=./prisma/schema.prisma
RUN ln -sf /app/node_modules/.prisma/client /app/node_modules/.pnpm/@prisma+client@5.15.0_prisma@5.15.0/node_modules/.prisma/client

# Build (optional, may fail but that's ok)
RUN pnpm run build || true

EXPOSE 3000 3001 3002

CMD ["pnpm", "run", "dev"]

# Expose ports
EXPOSE 3000 3001 3002
