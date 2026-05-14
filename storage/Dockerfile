# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
# Sharp requires some native dependencies on Alpine
RUN apk add --no-cache python3 make g++ 
COPY package*.json ./
RUN npm ci
COPY . .

# Production Stage
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache vips-dev
COPY --from=build /app/package*.json ./
COPY --from=build /app/src ./src
RUN npm ci --only=production

# Create logs and uploads directory
RUN mkdir -p logs uploads && chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=4009
ENV LOCAL_STORAGE_PATH=./uploads

EXPOSE 4009
VOLUME ["/app/uploads"]
CMD ["node", "src/app.js"]
