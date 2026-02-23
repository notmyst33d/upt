FROM docker.io/oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

CMD ["bun", "build/index.js"]
