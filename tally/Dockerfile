# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy only the necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/src ./src

# Install only production dependencies
RUN npm ci --only=production

# Create a non-root user with UID 1001 and set up log directory ownership
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser && \
    mkdir -p /app/logs && \
    chown -R 1001:1001 /app

# Use non-root user for security
USER 1001

ENV NODE_ENV=production
ENV PORT=4001

EXPOSE 4001

CMD ["node", "src/app.js"]
