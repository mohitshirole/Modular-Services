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
RUN mkdir -p logs && chown -R node:node /app
USER node
ENV NODE_ENV=production
ENV PORT=4008
EXPOSE 4008
CMD ["node", "src/app.js"]
