# Media & Asset Hub Microservice

A centralized, multi-provider service for file uploads, image optimization, and secure asset management.

## 🚀 Features

- **Multi-Storage Support**: Switch between **Local**, **AWS S3**, and **Azure Blob**.
- **Folder Bifurcation**: Organize assets by app, client, or type using dynamic paths.
- **Image Optimization**: Built-in auto-resizing and format conversion (WebP/JPEG) using Sharp.
- **Secure Access**: Generate temporary Presigned URLs for private cloud assets.
- **Stateless & Scalable**: Pass provider credentials in each request.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=4009
   LOCAL_STORAGE_PATH=./uploads
   ```

## 📖 API Reference

### 1. Upload File
`POST /api/v1/storage/upload` (multipart/form-data)

**Form Fields:**
- `file`: The binary file.
- `provider`: `local`, `s3`, or `azure`.
- `folder`: e.g., `datapod/client-a/receipts`.
- `resize`: `{ "width": 800, "quality": 80 }` (Optional).
- `config`: JSON string of provider credentials (Optional).

### 2. Generate Signed URL
`POST /api/v1/storage/url`

## 🐳 Docker Usage

```bash
docker build -t media-hub .
docker run -p 4009:4009 -v $(pwd)/uploads:/app/uploads media-hub
```
