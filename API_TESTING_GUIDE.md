# ReportMind AI - API Testing Guide

## Base URL
```
http://localhost:3000
```

## Authentication Header
All requests (except health check) can include:
```
Authorization: Bearer userid:orgid:email@example.com
```

Example:
```
Authorization: Bearer user123:org456:john@company.com
```

---

## 🏥 Health Check

### Request
```bash
curl -X GET http://localhost:3000/health
```

### Response (200 OK)
```json
{
  "status": "OK",
  "service": "ReportMind AI Backend"
}
```

---

## 📤 Upload Report

### Endpoint
```
POST /api/v1/reports/upload
```

### Request (Form Data)
```bash
curl -X POST http://localhost:3000/api/v1/reports/upload \
  -F "file=@sample.pdf" \
  -H "Authorization: Bearer user123:org456:john@example.com"
```

### Response (202 Accepted)
```json
{
  "reportId": "report-1704564000000",
  "jobId": "job-abc123",
  "status": "PROCESSING",
  "fileName": "sample.pdf"
}
```

### Error Responses
**400 Bad Request** - No file:
```json
{ "message": "PDF file is required" }
```

**400 Bad Request** - Wrong file type:
```json
{ "message": "Only PDF files are allowed" }
```

---

## 📋 List All Reports

### Endpoint
```
GET /api/v1/reports
```

### Request with Parameters
```bash
curl "http://localhost:3000/api/v1/reports?page=1&limit=10&status=COMPLETED" \
  -H "Authorization: Bearer user123:org456:john@example.com"
```

### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (UPLOADED, PROCESSING, COMPLETED, FAILED)

### Response (200 OK)
```json
{
  "data": [
    {
      "_id": "report-1704564000000",
      "fileName": "sample.pdf",
      "fileUrl": "/uploads/reports/sample.pdf",
      "status": "COMPLETED",
      "totalPages": 45,
      "detectedDomains": ["finance", "esg"],
      "createdAt": "2026-01-06T10:00:00.000Z"
    },
    {
      "_id": "report-1704563990000",
      "fileName": "annual-report.pdf",
      "fileUrl": "/uploads/reports/annual-report.pdf",
      "status": "PROCESSING",
      "totalPages": null,
      "detectedDomains": [],
      "createdAt": "2026-01-06T09:59:30.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "pages": 3
  }
}
```

---

## 📊 Get Report by ID

### Endpoint
```
GET /api/v1/reports/:reportId
```

### Request
```bash
curl http://localhost:3000/api/v1/reports/report-1704564000000 \
  -H "Authorization: Bearer user123:org456:john@example.com"
```

### Response (200 OK)
```json
{
  "report": {
    "_id": "report-1704564000000",
    "fileName": "sample.pdf",
    "fileUrl": "/uploads/reports/sample.pdf",
    "status": "COMPLETED",
    "totalPages": 45,
    "detectedDomains": ["finance", "esg"],
    "createdAt": "2026-01-06T10:00:00.000Z"
  },
  "summary": {
    "sectionsCount": 12,
    "tablesCount": 8,
    "metricsCount": 45,
    "narrativesCount": 15
  },
  "data": {
    "sections": [
      {
        "_id": "section-1",
        "reportId": "report-1704564000000",
        "pageNumber": 2,
        "heading": "FINANCIAL OVERVIEW",
        "content": "This section provides...",
        "depth": 1
      }
    ],
    "tables": [
      {
        "_id": "table-1",
        "reportId": "report-1704564000000",
        "pageNumber": 5,
        "rowCount": 10,
        "columnCount": 4,
        "headers": ["Year", "Revenue", "Profit", "Margin"],
        "rows": [
          ["2023", "$100M", "$25M", "25%"],
          ["2024", "$120M", "$30M", "25%"]
        ],
        "summary": "Table with 10 rows, 4 columns. Contains numeric data."
      }
    ],
    "metrics": [
      {
        "_id": "metric-1",
        "reportId": "report-1704564000000",
        "name": "revenue",
        "value": "$100M",
        "unit": "USD",
        "pageNumber": 3,
        "context": "...total revenue reached $100M in 2023..."
      }
    ],
    "narratives": [
      {
        "_id": "narrative-1",
        "reportId": "report-1704564000000",
        "sectionId": "section_0",
        "content": "Financial performance improved significantly...",
        "pageNumber": 2,
        "wordCount": 250,
        "sentiment": "positive"
      }
    ]
  }
}
```

### Error Response (404 Not Found)
```json
{ "message": "Report not found" }
```

---

## ✅ Get Report Status

### Endpoint
```
GET /api/v1/reports/:reportId/status
```

### Request
```bash
curl http://localhost:3000/api/v1/reports/report-1704564000000/status \
  -H "Authorization: Bearer user123:org456:john@example.com"
```

### Response (200 OK)
```json
{
  "reportId": "report-1704564000000",
  "status": "COMPLETED",
  "fileName": "sample.pdf",
  "createdAt": "2026-01-06T10:00:00.000Z"
}
```

### Possible Status Values
- `UPLOADED` - File uploaded but not yet processed
- `PROCESSING` - Currently being processed
- `COMPLETED` - Processing finished successfully
- `FAILED` - Processing encountered an error

---

## 🗑️ Delete Report

### Endpoint
```
DELETE /api/v1/reports/:reportId
```

### Request
```bash
curl -X DELETE http://localhost:3000/api/v1/reports/report-1704564000000 \
  -H "Authorization: Bearer user123:org456:john@example.com"
```

### Response (200 OK)
```json
{
  "message": "Report deleted successfully",
  "reportId": "report-1704564000000"
}
```

### Error Response (404 Not Found)
```json
{ "message": "Report not found" }
```

---

## 🧪 Testing Workflow

### Step 1: Upload Report
```bash
# Note the reportId from response
REPORT_ID=$(curl -s -X POST http://localhost:3000/api/v1/reports/upload \
  -F "file=@sample.pdf" \
  -H "Authorization: Bearer user:org:user@example.com" | jq -r '.reportId')

echo "Report ID: $REPORT_ID"
```

### Step 2: Check Status (Immediate)
```bash
curl "http://localhost:3000/api/v1/reports/$REPORT_ID/status" \
  -H "Authorization: Bearer user:org:user@example.com" | jq '.'
# Result: status = "PROCESSING"
```

### Step 3: Wait for Completion
```bash
# Wait 10-30 seconds for pipeline to complete
sleep 15

# Check status again
curl "http://localhost:3000/api/v1/reports/$REPORT_ID/status" \
  -H "Authorization: Bearer user:org:user@example.com" | jq '.'
# Result: status = "COMPLETED"
```

### Step 4: Retrieve Results
```bash
curl "http://localhost:3000/api/v1/reports/$REPORT_ID" \
  -H "Authorization: Bearer user:org:user@example.com" | jq '.'
```

### Step 5: List All Reports
```bash
curl "http://localhost:3000/api/v1/reports?page=1&limit=5&status=COMPLETED" \
  -H "Authorization: Bearer user:org:user@example.com" | jq '.'
```

### Step 6: Delete Report
```bash
curl -X DELETE "http://localhost:3000/api/v1/reports/$REPORT_ID" \
  -H "Authorization: Bearer user:org:user@example.com" | jq '.'
```

---

## 📝 Postman Collection

Import this into Postman as a collection:

```json
{
  "info": {
    "name": "ReportMind AI API",
    "description": "Complete API for PDF processing",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Upload Report",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{userId}}:{{orgId}}:{{email}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "value": ""
            }
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/reports/upload",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "reports", "upload"]
        }
      }
    },
    {
      "name": "List Reports",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{userId}}:{{orgId}}:{{email}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/reports?page=1&limit=10&status=COMPLETED",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "reports"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "limit",
              "value": "10"
            },
            {
              "key": "status",
              "value": "COMPLETED"
            }
          ]
        }
      }
    },
    {
      "name": "Get Report by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{userId}}:{{orgId}}:{{email}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/reports/{{reportId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "reports", "{{reportId}}"]
        }
      }
    },
    {
      "name": "Get Report Status",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{userId}}:{{orgId}}:{{email}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/reports/{{reportId}}/status",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "reports", "{{reportId}}", "status"]
        }
      }
    },
    {
      "name": "Delete Report",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{userId}}:{{orgId}}:{{email}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/reports/{{reportId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "reports", "{{reportId}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "userId",
      "value": "user123"
    },
    {
      "key": "orgId",
      "value": "org456"
    },
    {
      "key": "email",
      "value": "user@example.com"
    },
    {
      "key": "reportId",
      "value": ""
    }
  ]
}
```

---

## 🔍 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET, DELETE |
| 202 | Accepted (async) | POST /upload |
| 400 | Bad Request | Missing file |
| 404 | Not Found | Invalid reportId |
| 500 | Server Error | DB connection failed |

---

## 📊 Common Test Scenarios

### Scenario 1: Happy Path (Full Flow)
```bash
# 1. Upload
REPORT_ID=$(curl -s -X POST http://localhost:3000/api/v1/reports/upload \
  -F "file=@sample.pdf" | jq -r '.reportId')

# 2. Wait
sleep 20

# 3. Check status
curl "http://localhost:3000/api/v1/reports/$REPORT_ID/status" | jq '.'

# 4. Get results
curl "http://localhost:3000/api/v1/reports/$REPORT_ID" | jq '.'
```

### Scenario 2: Error Handling
```bash
# Try to upload non-PDF
curl -X POST http://localhost:3000/api/v1/reports/upload \
  -F "file=@notapdf.txt"
# Result: 400 "Only PDF files are allowed"

# Try to get non-existent report
curl http://localhost:3000/api/v1/reports/invalid-id
# Result: 404 "Report not found"
```

### Scenario 3: Pagination
```bash
# Get first 5 reports
curl "http://localhost:3000/api/v1/reports?page=1&limit=5"

# Get next 5 reports
curl "http://localhost:3000/api/v1/reports?page=2&limit=5"

# Filter completed only
curl "http://localhost:3000/api/v1/reports?status=COMPLETED"
```

---

**Ready to test! 🧪**
