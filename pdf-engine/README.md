# PDF Rendering Engine Microservice

A high-fidelity HTML-to-PDF rendering engine powered by **Puppeteer** and **Handlebars**. Designed for generating dynamic, branded documents for multiple clients.

## 🚀 Features

- **Dynamic Templates**: Send raw HTML strings with Handlebars placeholders (`{{variable}}`).
- **Headless Chrome Rendering**: Support for modern CSS, Flexbox, Grid, and Web Fonts.
- **Custom Branding**: Every request can have its own HTML/CSS, enabling client-specific layouts.
- **Headers & Footers**: Native support for repeating headers and footers (with page numbers).
- **Binary Streaming**: Efficiently stream PDF buffers directly to the browser.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=4005
   ```

## 📖 API Reference

### 1. Render PDF (Stream)
`POST /api/v1/pdf/render`

**Sample Payload:**
```json
{
  "html": "<html><body><h1>Hello {{name}}</h1><p>Your balance is {{amount}}</p></body></html>",
  "data": {
    "name": "Mohit",
    "amount": "₹50,000"
  },
  "pdfOptions": {
    "format": "A4",
    "margin": { "top": "20mm", "bottom": "20mm" }
  }
}
```

## 🐳 Docker Usage

This Dockerfile is pre-configured with Chromium dependencies.

```bash
docker build -t pdf-engine .
docker run -p 4005:4005 pdf-engine
```
