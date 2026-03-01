# Multi-stage build for optimized Next.js application
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files (package-lock.json included when available)
COPY package.json package-lock.json ./

# Install production dependencies only (ci for deterministic installs)
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies (ci for deterministic installs)
RUN npm ci && \
    npm cache clean --force

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:18-alpine AS runner

# Accept PORT as a build argument
ARG PORT

WORKDIR /app

# Set timezone to Asia/Jakarta
ENV TZ=Asia/Jakarta
RUN apk add --no-cache tzdata

# Set to production environment
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary configuration files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./

# Copy public folder (static assets)
COPY --from=builder /app/public ./public

# Copy built application output only (src/ not needed at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy production dependencies from deps stage
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

# Expose port from build argument
EXPOSE ${PORT}

# Start the application
CMD ["node", "server.js"]
