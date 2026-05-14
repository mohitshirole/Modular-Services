# Identity Gateway Microservice

A centralized authentication and identity gateway integrated with **Authentik** using OpenID Connect (OIDC).

## 🚀 Features

- **Unified Login**: Centralized "Login with Authentik" flow for all your apps.
- **Stateless JWT**: Issues signed JSON Web Tokens (JWT) for secure service-to-service communication.
- **Provider Discovery**: Automatically discovers Authentik settings via OIDC Discovery.
- **Verification API**: Dedicated endpoint for other microservices to verify user tokens.
- **Production Grade**: Structured logging with Winston and security hardening with Helmet.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=4004
   JWT_SECRET=...
   AUTHENTIK_DISCOVERY_URL=...
   AUTHENTIK_CLIENT_ID=...
   AUTHENTIK_CLIENT_SECRET=...
   ```

## 📖 API Reference

### 1. Start Login
`GET /api/v1/auth/login`
Redirects the browser to the Authentik login page.

### 2. Verify Token
`GET /api/v1/auth/verify`
Used by other services to check if a token is valid.

**Header:**
`Authorization: Bearer <token>`

## 🐳 Docker Usage

```bash
docker build -t identity-gateway .
docker run -p 4004:4004 --env-file .env identity-gateway
```
