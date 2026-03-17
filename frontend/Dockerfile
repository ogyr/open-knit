FROM node:21-alpine3.20 AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:21-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g serve
COPY --from=builder /app/dist .
EXPOSE 8080

CMD ["serve", "-s", "/app", "-l", "8080"]
