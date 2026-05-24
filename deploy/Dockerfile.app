# Runtime image for ax-coworker-be (the "app" — BE + bundled UI assets in public/).
# Jenkins builds the workspace + runs `pnpm --filter ax-cowork-be deploy --prod ./deploy/out/app`
# before this Dockerfile runs, so we only ship the prebuilt artifact tree.
FROM node:24-alpine
WORKDIR /app

# Copy the pnpm-deploy output: dist/, public/, package.json, node_modules/.
COPY ./deploy/out/app/ ./

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "dist/main.js"]
