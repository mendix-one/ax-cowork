# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the ax-data-integration service.
#
# Build context MUST be the repo root (because the pnpm workspace + shared packages
# live above this folder). Build with:
#
#   docker build -f services/ax-data-integration/Dockerfile -t ax-data-integration:local .
#
# Run with the same env vars documented in services/ax-data-integration/README.md.

# ---- Stage 1: shared base for builder + deployer ------------------------------
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# ---- Stage 2: install workspace deps + build the service ----------------------
FROM base AS builder
WORKDIR /workspace

# Lockfile + workspace manifests first — keeps the install layer cacheable across
# source-only edits. Copy each package.json individually so pnpm can resolve the
# workspace graph without dragging in source files yet.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc* ./
COPY shared/ax-common/package.json ./shared/ax-common/
COPY shared/ax-control-table/package.json ./shared/ax-control-table/
COPY services/ax-data-integration/package.json ./services/ax-data-integration/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @ax-cowork/shared --filter ax-data-integration...

# Now bring in the source.
COPY shared/ax-common ./shared/ax-common
COPY services/ax-data-integration ./services/ax-data-integration

# Build the shared lib first (ax-data-integration depends on its dist/) then the service.
RUN pnpm --filter @ax-cowork/shared build \
 && pnpm --filter ax-data-integration build

# ---- Stage 3: produce a self-contained deploy artifact -----------------------
# `pnpm deploy --prod` resolves workspace:* to real packages, strips devDependencies,
# and emits a flat node_modules in /deploy — exactly what the runner needs.
FROM base AS deployer
WORKDIR /workspace
COPY --from=builder /workspace /workspace
# `--legacy` opts back into pre-pnpm-v10 deploy semantics (no inject-workspace-packages
# requirement). The repo does not use injected workspace deps, so legacy is the right mode.
RUN pnpm deploy --legacy --filter ax-data-integration --prod /deploy

# ---- Stage 4: minimal runtime image ------------------------------------------
FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3012
WORKDIR /app

# Non-root user — alpine ships `node` (uid 1000) by default in this image.
USER node

COPY --from=deployer --chown=node:node /deploy/dist ./dist
COPY --from=deployer --chown=node:node /deploy/node_modules ./node_modules
COPY --from=deployer --chown=node:node /deploy/package.json ./package.json

EXPOSE 3012

# Liveness probe — matches the in-app /health endpoint (no DB, no API key).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3012)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main"]
