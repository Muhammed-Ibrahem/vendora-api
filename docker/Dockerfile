# ===================
# =   Base Stage    =
# ===================

FROM node:24-alpine AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# =========================
# =   Development Stage   =
# =========================
FROM base AS development

CMD ["pnpm", "dev"]

# ===================
# =   Build Stage   =
# ===================

FROM base AS builder

RUN pnpm build

# ====================
# = Production Stage =
# ====================
FROM node:24-alpine AS production

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/Infrastructure/Database/Migrations ./dist/Infrastructure/Database/Migrations
COPY --from=builder /app/public ./dist/public

CMD ["pnpm", "start"]

# ======================
# =   Dev Migrations   =
# ======================
FROM base AS migration-dev

CMD ["pnpm", "migrate:dev", "up"]

# =============================
# =   Production Migrations   =
# =============================
FROM production AS migration-prod

CMD ["pnpm", "migrate:prod", "up"]