# ============================================
# Backend NestJS — Multi-stage Production Build
# ============================================
# Build context: project root (KTV-System/)
# Usage: docker build -f backend/Dockerfile .
# ============================================

FROM node:22-alpine AS base
RUN corepack enable pnpm
WORKDIR /app

# -------------------------------------------
# Stage 1: Install all workspace dependencies
# -------------------------------------------
FROM base AS deps

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY ktv_cus/package.json ./ktv_cus/
COPY ktv_manager/package.json ./ktv_manager/
RUN mkdir -p shared

RUN pnpm install --frozen-lockfile

# -------------------------------------------
# Stage 2: Build application
# -------------------------------------------
FROM deps AS build

COPY backend/ ./backend/
COPY shared/ ./shared/

WORKDIR /app/backend
RUN pnpm exec prisma generate
RUN pnpm run build

# Create standalone production bundle (resolves pnpm symlinks into real files)
RUN pnpm --filter=backend deploy --prod /prod

# Copy build artifacts into the production bundle
RUN cp -r /app/backend/dist /prod/dist
RUN cp -r /app/backend/prisma /prod/prisma
RUN cp /app/backend/prisma.config.ts /prod/prisma.config.ts

# Regenerate Prisma client inside the production bundle
WORKDIR /prod
RUN ./node_modules/.bin/prisma generate

# -------------------------------------------
# Stage 3: Production image
# -------------------------------------------
FROM node:22-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build --chown=nestjs:nodejs /prod ./

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main"]
