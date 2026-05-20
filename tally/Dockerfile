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

# Create logs directory
RUN mkdir -p logs && chown -R node:node /app

# Use non-root user for security
USER node

ENV NODE_ENV=production
ENV PORT=4001

EXPOSE 4001

CMD ["node", "src/app.js"]
