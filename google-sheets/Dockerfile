# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production Stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/src ./src
RUN npm ci --only=production

# Create a non-root user with UID 1001 and set up log directory ownership
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser && \
    mkdir -p /app/logs && \
    chown -R 1001:1001 /app

# Use non-root user for security
USER 1001

ENV NODE_ENV=production
ENV PORT=4002
EXPOSE 4002
CMD ["node", "src/app.js"]
