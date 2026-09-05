# ============================================
# Manager Frontend — Multi-stage Production Build
# ============================================
# Build context: project root (KTV-System/)
# Usage: docker build -f ktv_manager/Dockerfile .
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
# Stage 2: Build Next.js (standalone output)
# -------------------------------------------
FROM deps AS build

COPY ktv_manager/ ./ktv_manager/
COPY shared/ ./shared/

# NEXT_PUBLIC_* vars are inlined at build time — pass via --build-arg
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_APP_NAME

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}

WORKDIR /app/ktv_manager
RUN pnpm run build

# -------------------------------------------
# Stage 3: Production image
# -------------------------------------------
FROM node:22-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

ENV NODE_ENV=production

# Next.js standalone output (monorepo-aware structure)
COPY --from=build --chown=nextjs:nodejs /app/ktv_manager/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/ktv_manager/.next/static ./ktv_manager/.next/static
COPY --from=build --chown=nextjs:nodejs /app/ktv_manager/public ./ktv_manager/public

USER nextjs

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/ktv_manager
CMD ["node", "server.js"]
