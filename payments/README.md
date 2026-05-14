# Payment Gateway Hub Microservice

A stateless, unified payment gateway for **Razorpay** integrations. Designed to support multiple clients with their own credentials.

## 🚀 Features

- **Multi-Tenant Ready**: Pass `keyId` and `keySecret` in the request to use different client accounts.
- **Secure Order Creation**: Generates Razorpay orders for frontend checkout.
- **Signature Verification**: Crypographically verifies payment signatures to prevent fraud.
- **Fintech Optimized**: Built for speed and reliability in financial transactions.
- **Production Grade**: Structured logging and security hardening.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=4008
   ```

## 📖 API Reference

### 1. Create Order
`POST /api/v1/payments/order`

**Sample Payload:**
```json
{
  "amount": 500,
  "currency": "INR",
  "receipt": "order_rcptid_11",
  "config": {
    "keyId": "rzp_test_...",
    "keySecret": "..."
  }
}
```

### 2. Verify Payment
`POST /api/v1/payments/verify`

**Sample Payload:**
```json
{
  "orderId": "order_9A78...",
  "paymentId": "pay_29AC...",
  "signature": "...",
  "config": {
    "keySecret": "..."
  }
}
```

## 🐳 Docker Usage

```bash
docker build -t payments-hub .
docker run -p 4008:4008 payments-hub
```
