# Use official Node.js LTS image
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy built files and Prisma migrations
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Set environment variables (override in deployment)
ENV NODE_ENV=production

# Expose ports for HTTP and WebSocket servers
EXPOSE 8000
EXPOSE 8080

# Run Prisma migrations and start the app
CMD npx prisma migrate deploy && node dist/index.js
