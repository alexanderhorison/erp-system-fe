# Simple, reliable Dockerfile for Next.js application
FROM node:18-alpine

# Accept PORT as a build argument from docker-compose
ARG PORT

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

# Expose port from build argument
EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]
