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

# Create logs and data directory for SQLite
RUN mkdir -p logs data && chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=4007
ENV DB_STORAGE=./data/scheduler.sqlite

EXPOSE 4007
CMD ["node", "src/app.js"]
