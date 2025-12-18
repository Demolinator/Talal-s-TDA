# Phase 2 Auth Server - Node.js Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install

# Copy application code
COPY . .

# Build TypeScript code
RUN npm run build

# Remove devDependencies to reduce image size (optional)
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
