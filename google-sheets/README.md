# Google Sheets Engine Microservice

A high-performance, stateless engine for reading, merging, and syncing data with Google Sheets. Designed for production workflows where data integrity and "Strict Update" logic are critical.

## 🚀 Features

- **Metadata Discovery**: Instantly fetch tab names and headers for any spreadsheet.
- **Smart Importer**: Fetch and merge data from multiple tabs with support for "Merged Fields."
- **Production Sync**: Advanced "Match & Update" logic with support for composite keys.
- **Strict Mode**: Defaults to "Update-Only" to prevent accidental row appends.
- **Batch Optimized**: Uses `batchUpdate` and `append` to stay within Google API limits.
- **Docker Ready**: Multi-stage build for rapid deployment.

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Place your `service-account.json` in the root directory.
3. Configure `.env`:
   ```env
   PORT=4002
   GOOGLE_SERVICE_ACCOUNT_FILE=./service-account.json
   ```

## 📖 API Reference

### 1. Get Metadata
`POST /api/v1/sheets/metadata`
Returns tabs and their header columns.

### 2. Read Data
`POST /api/v1/sheets/read`
Fetch and merge data using a "Recipe."

### 3. Sync Data
`POST /api/v1/sheets/sync`
Update or Append data based on identity matching.

**Sample Sync Payload (Update Only):**
```json
{
  "spreadsheetId": "YOUR_SHEET_ID",
  "tabName": "Inventory",
  "upsert": false,
  "syncData": [
    { 
      "match": { "Unit": "A-101" }, 
      "update": { "Status": "Sold", "Price": 7500000 } 
    }
  ]
}
```

## 🐳 Docker Usage

```bash
docker build -t sheets-engine .
docker run -p 4002:4002 --env-file .env sheets-engine
```
