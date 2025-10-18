# Simple, reliable Dockerfile for Next.js application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Expose port (actual port is set via environment variable in docker-compose)
# Default expose for documentation purposes
EXPOSE 5001

# Start the application
CMD ["npm", "start"]
