# Multi-stage build for optimized Next.js application
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies only with npm ci for better reproducibility
RUN npm install --only=production && \
    npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install && \
    npm cache clean --force

# Copy only necessary source files for build
COPY next.config.js ./
COPY jsconfig.json ./
COPY server.js ./
COPY public ./public
COPY src ./src
COPY styles ./styles

# Build the application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:18-alpine AS runner

# Accept PORT as a build argument
ARG PORT

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary configuration files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/jsconfig.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./

# Copy public folder (only required static assets)
COPY --from=builder /app/public ./public

# Copy src and styles folders (needed for server-side rendering)
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/styles ./styles

# Copy the entire .next folder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy production dependencies from deps stage
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nextjs

# Expose port from build argument
EXPOSE ${PORT}

# Start the application
CMD ["node", "server.js"]
