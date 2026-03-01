# Multi-stage build for optimized Next.js application
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install deps FIRST so this layer is cached
# independently of env var changes
COPY package.json package-lock.json ./
RUN npm install && \
    npm cache clean --force

# Declare NEXT_PUBLIC build-time args AFTER npm install to preserve cache
ARG NEXT_PUBLIC_ENVIRONTMENT
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEVELOPMENT_MODE
ARG NEXT_PUBLIC_SECRET_KEY
ARG NEXT_PUBLIC_ENABLE_PWA
ARG NEXT_PUBLIC_JWT_EXPIRATION
ARG NEXT_PUBLIC_JWT_SECRET
ARG NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET

# Expose them as ENV so Next.js build picks them up
ENV NEXT_PUBLIC_ENVIRONTMENT=${NEXT_PUBLIC_ENVIRONTMENT}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_DEVELOPMENT_MODE=${NEXT_PUBLIC_DEVELOPMENT_MODE}
ENV NEXT_PUBLIC_SECRET_KEY=${NEXT_PUBLIC_SECRET_KEY}
ENV NEXT_PUBLIC_ENABLE_PWA=${NEXT_PUBLIC_ENABLE_PWA}
ENV NEXT_PUBLIC_JWT_EXPIRATION=${NEXT_PUBLIC_JWT_EXPIRATION}
ENV NEXT_PUBLIC_JWT_SECRET=${NEXT_PUBLIC_JWT_SECRET}
ENV NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET=${NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET}

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
