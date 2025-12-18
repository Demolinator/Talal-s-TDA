# Phase 2 Auth Server - Node.js Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

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
