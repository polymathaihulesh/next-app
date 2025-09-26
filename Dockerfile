# ---- Base image ----
# Use the official Bun image for a lean and fast environment
FROM oven/bun:1-alpine AS base

# Set working directory
WORKDIR /app

# ---- Install dependencies ----
# Install all dependencies (including dev) needed for the build
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Build the app ----
# Build the Next.js application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---- Production runtime ----
# Create the final, lean production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy build artifacts and package files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Install only production dependencies to keep the image small
RUN bun install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app using Bun
CMD ["bun", "start"]