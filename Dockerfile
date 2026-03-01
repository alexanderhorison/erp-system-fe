# Multi-stage build for optimized Next.js application
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies
RUN npm install && \
    npm cache clean --force

# Copy all source files
COPY . .

# Build the application (standalone output bundles only required files)
RUN npm run build

# Stage 2: Runner (Production)
FROM node:18-alpine AS runner

# Accept PORT as a build argument
ARG PORT

WORKDIR /app

# Set timezone to Asia/Jakarta
ENV TZ=Asia/Jakarta
RUN apk add --no-cache tzdata

# Set to production environment
ENV NODE_ENV=production

# Bind to all interfaces so healthcheck and internal requests work
ENV HOSTNAME=0.0.0.0

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output — includes only the minimal node_modules needed
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port from build argument
EXPOSE ${PORT}

# Use Next.js standalone server (supports PORT env var natively)
CMD ["node", "server.js"]
