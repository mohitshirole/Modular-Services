# Communication Gateway Microservice

A unified, provider-agnostic gateway for sending Email, SMS, and WhatsApp messages. Designed for high reliability and easy extensibility.

## 🚀 Features

- **Unified API**: One endpoint (`/send`) for all communication channels.
- **Provider Plugin System**: Easily switch between providers (SMTP, 2Factor, UltraMsg, etc.).
- **Robust Validation**: Strict Zod schemas for every request.
- **Production Logging**: Module-specific logs (`logs/comm-combined.log`).
- **Security**: Hardened with Helmet.js and CORS.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=4003
   SMTP_HOST=...
   TWOFACTOR_API_KEY=...
   ULTRAMSG_INSTANCE_ID=...
   ```

## 📖 API Reference

### 1. Send Message
`POST /api/v1/comm/send`

**WhatsApp (UltraMsg):**
```json
{
  "provider": "ultramsg",
  "to": "919876543210",
  "message": "Hello from Datapod!"
}
```

**SMS (2Factor):**
```json
{
  "provider": "2factor",
  "to": "919876543210",
  "message": "Your OTP is 1234"
}
```

**Email (SMTP):**
```json
{
  "provider": "smtp",
  "to": "client@example.com",
  "subject": "Booking Confirmation",
  "message": "Your booking is confirmed.",
  "html": "<h1>Confirmed!</h1><p>Your booking is confirmed.</p>"
}
```

## 🐳 Docker Usage

```bash
docker build -t comm-gateway .
docker run -p 4003:4003 --env-file .env comm-gateway
```
