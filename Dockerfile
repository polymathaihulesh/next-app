# ---- Base image ----
FROM oven/bun:1-alpine AS base
WORKDIR /app

# ---- Install dependencies ----
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Build the app ----
FROM base AS builder
WORKDIR /app

# Accept build-time envs from Cloud Build
ARG NEXT_PUBLIC_TEST_VAR=default-test-value
ARG NEXT_PUBLIC_API_URL=https://api-dev.example.com

# Expose them so Next.js can bake them into the bundle
ENV NEXT_PUBLIC_TEST_VAR=$NEXT_PUBLIC_TEST_VAR
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ---- Debug: Print env vars ----
RUN echo "NEXT_PUBLIC_TEST_VAR=$NEXT_PUBLIC_TEST_VAR" \
    && echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
RUN bun run build

# ---- Production runtime ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Install only production dependencies
RUN bun install --production

EXPOSE 3000

CMD ["bun", "start"]
