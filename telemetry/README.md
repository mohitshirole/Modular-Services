# Telemetry & Audit Microservice

A centralized, high-performance ledger for recording system events, usage metrics, and audit trails. Powered by **SQLite** for high-speed local persistence.

## 🚀 Features

- **High-Speed Logging**: Minimal latency impact on other services.
- **Audit Trail**: Track which user did what, in which app, at what time.
- **Performance Tracking**: Capture the duration of microservice operations.
- **Metadata Support**: Store dynamic JSON data for every event.
- **Filtered Retrieval**: Query logs by User, App, or Service.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=4006
   DB_STORAGE=./telemetry.sqlite
   ```

## 📖 API Reference

### 1. Record Event
`POST /api/v1/telemetry/log`

**Sample Payload:**
```json
{
  "appId": "CRM-Alpha",
  "userId": "user_123",
  "service": "PDF-Engine",
  "action": "RENDER_INVOICE",
  "status": "SUCCESS",
  "duration": 1200,
  "metadata": { "invoice_id": "INV-001", "client": "Saniket" }
}
```

### 2. Fetch Logs
`GET /api/v1/telemetry/logs?service=PDF-Engine&limit=10`

## 🐳 Docker Usage

This service uses a Docker volume to persist the SQLite database.

```bash
docker build -t telemetry-engine .
docker run -p 4006:4006 -v $(pwd)/data:/app/data telemetry-engine
```
