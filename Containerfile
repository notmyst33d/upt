FROM docker.io/oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun --bun install
RUN bun --bun run build

FROM docker.io/oven/bun:alpine AS runner

WORKDIR /app
COPY --from=builder /app/build build
COPY --from=builder /app/node_modules node_modules

CMD ["bun", "--bun", "run", "build/index.js"]
