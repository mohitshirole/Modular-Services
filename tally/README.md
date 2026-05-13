# Tally ERP Microservice Gateway

A stateless, production-ready gateway for communicating with Tally ERP. This service translates modern JSON requests into Tally's SOAP XML format using a dynamic template engine.

## 🚀 Features

- **Stateless Gateway**: No database required, just point-and-shoot XML translation.
- **Template Registry**: Centralized repository for complex Tally reports (Cost Centres, Ledgers, TDS, etc.).
- **Security**: Hardened with Helmet.js and Zod schema validation.
- **Production Logging**: Structured logging with Winston (`logs/tally-combined.log`).
- **Docker Ready**: Multi-stage build for optimized deployment.

## 🛠️ Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment in `.env`:
   ```env
   PORT=4001
   TALLY_URL=http://localhost:9000
   ```

## 📖 API Reference

### 1. Test Connection
`POST /api/v1/tally/test`
Verifies if the Tally Server is reachable.

### 2. Execute Report
`POST /api/v1/tally/execute`
Executes a specific report template.

**Sample Payload:**
```json
{
  "reportId": "COST_CENTRE_BREAKUP",
  "company": "Your Company Name",
  "from": "20240401",
  "to": "20240501",
  "config": {
    "costCentre": "Main Office"
  }
}
```

## 🐳 Docker Usage

Build the image:
```bash
docker build -t tally-microservice .
```

Run the container:
```bash
docker run -p 4001:4001 --env-file .env tally-microservice
```
