# ReportMind AI - Development Progress & Setup Guide

**Last Updated:** January 6, 2026  
**Status:** 🟢 Core Features Implemented & Ready for Testing

---

## 📋 What's Been Implemented

### ✅ Phase 1: Backend Foundation & Architecture
- **Express + TypeScript** server with proper structure
- **MongoDB** connection and model definitions
- **Redis + BullMQ** for async job processing
- **Azure Document Intelligence** integration for PDF parsing
- **Error handling middleware** with graceful error propagation
- **Optional authentication middleware** for user context

### ✅ Phase 2: Multi-Agent LangGraph Pipeline
All 9 agents fully implemented with logic:

1. **IngestionAgent** - Parses PDFs using Azure DI, extracts pages and tables
2. **StructureUnderstandingAgent** - Identifies document sections and structure
3. **DomainInferenceAgent** - Detects domains (finance, ESG, operations, risk, market)
4. **MetricDiscoveryAgent** - Finds quantitative metrics and numeric values
5. **TableExtractionAgent** - Processes and enriches table data with headers/rows
6. **NarrativeExtractionAgent** - Extracts narrative content with sentiment analysis
7. **FootnoteAgent** - Identifies footnotes and references with metric linkage
8. **ValidationAgent** - Validates extracted data and calculates confidence scores
9. **InsightAgent** - Generates insights and summary metrics

### ✅ Phase 3: API Endpoints
Fully implemented Report API endpoints:

```
POST   /api/v1/reports/upload          → Upload PDF (returns 202 Accepted)
GET    /api/v1/reports                 → List all reports (with pagination)
GET    /api/v1/reports/:reportId       → Get report with extracted data
GET    /api/v1/reports/:reportId/status → Check processing status
DELETE /api/v1/reports/:reportId       → Delete report
```

### ✅ Phase 4: Data Persistence
- Agents remain **stateless** (no DB writes)
- **PersistenceService** runs post-pipeline
- All extracted data saved to MongoDB collections:
  - DocumentSections
  - Tables
  - Narratives
  - Metrics
  - Footnotes
  - ExtractedValues
  - UnclassifiedData

### ✅ Phase 5: Error Handling & Reliability
- **Worker error handling** with detailed logging
- **Retry logic** configuration (max 3 attempts)
- **Job failure recovery** - reports marked as FAILED with error details
- **Comprehensive logging** at each pipeline stage

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Redis 6.0+
- Azure Document Intelligence resource (with endpoint & key)

### Environment Setup

Create `.env` file in `backend/` directory:

```bash
# Server
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/reportmind-ai

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Azure Document Intelligence
AZURE_DI_ENDPOINT=https://<region>.api.cognitive.microsoft.com/
AZURE_DI_KEY=<your-key>

# Optional
LOG_LEVEL=debug
```

### Installation & Running

```bash
# Install dependencies
cd backend
npm install

# Development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Production mode
npm start
```

The backend will start on `http://localhost:3000`

---

## 📊 API Usage Examples

### 1. Upload a PDF Report

```bash
curl -X POST http://localhost:3000/api/v1/reports/upload \
  -F "file=@report.pdf" \
  -H "Authorization: Bearer userid:orgid:email@example.com"
```

**Response (202 Accepted):**
```json
{
  "reportId": "report-1704564000000",
  "jobId": "job-123",
  "status": "PROCESSING",
  "fileName": "report.pdf"
}
```

### 2. Check Processing Status

```bash
curl http://localhost:3000/api/v1/reports/report-1704564000000/status
```

**Response:**
```json
{
  "reportId": "report-1704564000000",
  "status": "COMPLETED",
  "fileName": "report.pdf",
  "createdAt": "2026-01-06T10:00:00Z"
}
```

### 3. Retrieve Extracted Data

```bash
curl http://localhost:3000/api/v1/reports/report-1704564000000
```

**Response:**
```json
{
  "report": {
    "_id": "report-1704564000000",
    "fileName": "report.pdf",
    "status": "COMPLETED",
    "totalPages": 45,
    "detectedDomains": ["finance", "esg"]
  },
  "summary": {
    "sectionsCount": 12,
    "tablesCount": 8,
    "metricsCount": 45,
    "narrativesCount": 15
  },
  "data": {
    "sections": [...],
    "tables": [...],
    "metrics": [...],
    "narratives": [...]
  }
}
```

### 4. List All Reports

```bash
curl "http://localhost:3000/api/v1/reports?page=1&limit=10&status=COMPLETED"
```

### 5. Delete a Report

```bash
curl -X DELETE http://localhost:3000/api/v1/reports/report-1704564000000
```

---

## 🔍 Pipeline Execution Flow

```
PDF Upload
    ↓
Express API validates & creates report record
    ↓
BullMQ enqueues job to Redis
    ↓
Worker picks up job
    ↓
[LANGGRAPH PIPELINE]
    ├─→ IngestionAgent (Parse PDF with Azure DI)
    ├─→ StructureUnderstandingAgent (Identify sections)
    ├─→ DomainInferenceAgent (Detect domains)
    ├─→ MetricDiscoveryAgent (Find metrics)
    ├─→ TableExtractionAgent (Process tables)
    ├─→ NarrativeExtractionAgent (Extract text)
    ├─→ FootnoteAgent (Find references)
    ├─→ ValidationAgent (Validate & score)
    └─→ InsightAgent (Generate insights)
    ↓
PersistenceService saves to MongoDB
    ↓
Report status updated to COMPLETED
    ↓
API returns extracted data to client
```

---

## 📝 Agent Details

### IngestionAgent
**Input:** File path  
**Output:** Pages (with text), Tables (structured cells)  
**Process:** Uses Azure Document Intelligence prebuilt-layout model

### StructureUnderstandingAgent
**Input:** Pages (raw text)  
**Output:** Sections (heading + content)  
**Process:** Detects uppercase headings and organizes content hierarchically

### DomainInferenceAgent
**Input:** Pages + Sections  
**Output:** Top 3 domains by relevance score  
**Process:** Keyword matching against domain signatures

**Detected Domains:**
- finance (revenue, profit, EBITDA, margins)
- esg (carbon, sustainability, environmental)
- operations (efficiency, capacity, supply chain)
- risk (compliance, audit, threats)
- market (competitive, customer, sales)

### MetricDiscoveryAgent
**Input:** Pages + Tables  
**Output:** Discovered metrics with values and context  
**Process:** Regex pattern matching for key metrics + table cell extraction

### TableExtractionAgent
**Input:** Raw tables (cells from Azure DI)  
**Output:** Enriched tables with headers and row data  
**Process:** Builds grid, detects headers, flags numeric data

### NarrativeExtractionAgent
**Input:** Sections + Pages  
**Output:** Narrative blocks with sentiment  
**Process:** Sentiment analysis using keyword detection

### FootnoteAgent
**Input:** All pages + Metrics  
**Output:** Footnotes with linked metrics  
**Process:** Pattern matching for [1], * formats, and reference linking

### ValidationAgent
**Input:** All extracted data  
**Output:** Validation issues + confidence score (0-1)  
**Process:** Checks for completeness and flags missing data

**Deductions:**
- No pages: -0.30
- Empty table: -0.05 each
- No metrics: -0.10
- Unknown domain: -0.15
- Minimal content: -0.02 each

### InsightAgent
**Input:** All extracted data  
**Output:** 5-7 actionable insights  
**Process:** Generates summaries, trends, and anomalies

---

## 🔐 Authentication

### Current Implementation
Simple Bearer token format for development:

```
Authorization: Bearer userid:orgid:email@example.com
```

**In Production, You Should:**
1. Implement JWT token generation in Auth API
2. Validate JWT signatures
3. Add organization & permission checks
4. Implement rate limiting per user/org

Example setup:
```typescript
// Generate JWT in login endpoint
const token = jwt.sign(
  { userId, orgId, email, roles: ['user'] },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Validate in authMiddleware
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## 📊 Database Models

### Report
```
{
  _id: String,
  fileName: String,
  fileUrl: String,
  status: "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED",
  totalPages: Number,
  detectedDomains: [String],
  createdAt: Date
}
```

### DocumentSection
```
{
  reportId: String,
  pageNumber: Number,
  heading: String,
  content: String,
  depth: Number
}
```

### Table
```
{
  reportId: String,
  pageNumber: Number,
  rowCount: Number,
  columnCount: Number,
  headers: [String],
  rows: [[String]],
  summary: String
}
```

### Metric
```
{
  reportId: String,
  name: String,
  value: String | Number,
  unit: String,
  pageNumber: Number,
  context: String
}
```

---

## 🧪 Testing the Pipeline

### Quick Test with Sample PDF

1. **Upload a test PDF:**
```bash
curl -X POST http://localhost:3000/api/v1/reports/upload \
  -F "file=@sample.pdf" \
  --output response.json

cat response.json | jq '.reportId'
```

2. **Poll for completion:**
```bash
# Check status (should be PROCESSING initially)
curl http://localhost:3000/api/v1/reports/report-xxx/status

# Wait 10-30 seconds for processing
# Check again until status is COMPLETED
```

3. **Retrieve results:**
```bash
curl http://localhost:3000/api/v1/reports/report-xxx | jq '.'
```

### Expected Output
```json
{
  "report": {
    "status": "COMPLETED",
    "totalPages": 15,
    "detectedDomains": ["finance", "esg"]
  },
  "summary": {
    "sectionsCount": 8,
    "tablesCount": 5,
    "metricsCount": 32,
    "narrativesCount": 12
  }
}
```

---

## 🔍 Monitoring & Debugging

### View Worker Logs
```bash
# Terminal where backend is running should show detailed logs:
🚀 Starting report processing job...
📋 Initial state prepared
🔄 Executing report graph pipeline...
✅ IngestionAgent started
📊 Azure DI pages: 15
🏗️ StructureUnderstandingAgent analyzing...
✅ Identified 8 document sections
🔍 DomainInferenceAgent inferring...
✅ Detected domains: finance, esg
...
✅ Report processing completed successfully
```

### Check Redis Queue
```bash
# Install redis-cli
redis-cli

# View pending jobs
> LLEN bull:report-queue:wait

# View active jobs
> LLEN bull:report-queue:active

# View completed jobs
> LLEN bull:report-queue:completed
```

### Check MongoDB
```bash
# Connect to MongoDB
mongosh reportmind-ai

# View reports
db.reports.find()

# View extracted sections
db.documentsections.find()

# View metrics
db.metrics.find()
```

---

## 🚨 Common Issues & Solutions

### Issue: "Azure DI Endpoint not found"
**Solution:** Ensure `.env` has `AZURE_DI_ENDPOINT` and `AZURE_DI_KEY` set correctly

### Issue: "Connection refused to Redis"
**Solution:** Ensure Redis is running:
```bash
redis-server  # Start Redis if not running
```

### Issue: "No pages extracted"
**Solution:** Verify PDF format is supported by Azure DI (prebuilt-layout model)

### Issue: "Job marked as FAILED"
**Solution:** Check backend console logs for error details, then retry upload

### Issue: "High memory usage"
**Solution:** Reduce worker concurrency or limit job queue size in production

---

## 📈 Performance Optimization

### Currently
- **Concurrency:** 2 jobs per worker
- **Retry:** Up to 3 attempts
- **Lock duration:** 60 seconds per job

### For Scale
1. Increase concurrency (if hardware allows)
2. Use multiple workers across different servers
3. Add job batching for similar reports
4. Implement caching for domain/metric detection

---

## 🔜 Next Steps / TODO

### High Priority
- [ ] Implement real JWT authentication in Auth API
- [ ] Add pagination to data retrieval endpoints
- [ ] Implement dashboard data aggregation endpoint
- [ ] Add report filtering and search
- [ ] Setup production MongoDB and Redis with auth

### Medium Priority
- [ ] Add webhook notifications for job completion
- [ ] Implement organization-level data isolation
- [ ] Add user roles and permissions system
- [ ] Setup logging aggregation (ELK/DataDog)
- [ ] Add performance metrics collection

### Low Priority
- [ ] Add rate limiting per user/API key
- [ ] Implement report version history
- [ ] Add export functionality (PDF, CSV)
- [ ] Frontend dashboard UI
- [ ] API documentation (Swagger/OpenAPI)

---

## 📚 File Structure Reference

```
backend/
├── src/
│   ├── agents/                 # LangGraph AI agents
│   │   ├── base.agent.ts       # Agent type definition
│   │   ├── ingestion.agent.ts
│   │   ├── structure.agent.ts
│   │   ├── domain.agent.ts
│   │   ├── metricDiscovery.agent.ts
│   │   ├── tableExtraction.agent.ts
│   │   ├── narrative.agent.ts
│   │   ├── footnote.agent.ts
│   │   ├── validation.agent.ts
│   │   └── insight.agent.ts
│   ├── api/
│   │   └── reports/
│   │       ├── report.controller.ts    # API endpoints
│   │       └── report.routes.ts
│   ├── config/
│   │   ├── db.ts               # MongoDB connection
│   │   └── redis.ts            # Redis connection
│   ├── graph/
│   │   ├── graph.state.ts      # State definitions
│   │   └── report.graph.ts     # LangGraph orchestration
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/                 # MongoDB schemas
│   ├── queues/
│   │   └── report.queue.ts     # BullMQ queue
│   ├── services/
│   │   ├── azureDocumentIntelligence.service.ts
│   │   ├── fileUpload.service.ts
│   │   └── persistence.service.ts
│   ├── workers/
│   │   └── report.worker.ts    # Job worker
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
```

---

## 💡 Tips for Contributors

1. **Keep agents pure** - No database writes in agents, only state updates
2. **Add logging** - Use `console.log` with emojis for easy scanning
3. **Type everything** - Use TypeScript interfaces for state shape
4. **Test incrementally** - Upload small PDFs first, then larger ones
5. **Check logs** - Always check terminal logs before assuming errors

---

## 📞 Support

For issues or questions:
1. Check the console logs for detailed error messages
2. Review this documentation
3. Check MongoDB for data verification
4. Verify environment variables are set correctly

---

**Happy coding! 🚀**
