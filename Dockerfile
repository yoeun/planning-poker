# Build stage for client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install Redis
RUN apk add --no-cache redis

# Install server dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy server code
COPY server/ ./

# Copy built client
COPY --from=client-builder /app/client/dist ./public

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3001

CMD ["./start.sh"]

