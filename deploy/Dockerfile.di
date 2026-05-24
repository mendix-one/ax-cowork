# Runtime image for ax-data-integration.
# Jenkins runs `pnpm --filter ax-data-integration deploy --prod ./deploy/out/di` first,
# so this image only copies the prebuilt artifact tree (dist/ + flat node_modules).
FROM node:24-alpine
WORKDIR /app

COPY ./deploy/out/di/ ./
RUN pwd
RUN ls -a

ENV NODE_ENV=production
ENV PORT=15001

EXPOSE 15001

CMD ["node", "dist/main.js"]
