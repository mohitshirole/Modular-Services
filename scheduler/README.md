# Scheduler & Workflow Microservice

A centralized engine for managing scheduled jobs and automated workflows. Orchestrates interactions between all other microservices.

## 🚀 Features

- **Persistent Cron Jobs**: Schedules are stored in **SQLite** and reloaded on startup.
- **Microservice Triggering**: Automatically calls other service endpoints (GET/POST).
- **Flexible Schedules**: Support for any standard Cron expression.
- **Dynamic Management**: Create, stop, and toggle jobs via API in real-time.
- **Robust Error Handling**: Logs job execution times and failures.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=4007
   DB_STORAGE=./scheduler.sqlite
   ```

## 📖 API Reference

### 1. Create a Job
`POST /api/v1/scheduler/jobs`

**Example: Daily Tally Sync at Midnight**
```json
{
  "name": "Daily-Tally-Sync",
  "cron": "0 0 * * *",
  "targetUrl": "http://tally-gateway:4001/api/v1/tally/sync",
  "method": "POST",
  "payload": { "force": true }
}
```

### 2. List Jobs
`GET /api/v1/scheduler/jobs`

## 🐳 Docker Usage

```bash
docker build -t scheduler-service .
docker run -p 4007:4007 -v $(pwd)/data:/app/data scheduler-service
```
