# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy necessary files from builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
# Copy .env file if it exists
# Try to copy .env file if it exists using shell commands instead of COPY
RUN touch .env && \
  if [ -f /builder/.env ]; then cp /builder/.env ./.env; fi

# Create volume for persistent data
VOLUME ["/app/data"]

# Expose the port (will be overridden by environment)
EXPOSE 3001

# Start the application using environment variables
CMD ["sh", "-c", "PORT=${PORT:-3001} NODE_ENV=${NODE_ENV:-production} npm start"]
