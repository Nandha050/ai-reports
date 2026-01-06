# Setup Checklist & Quick Start

## ✅ Pre-Flight Checklist

### 1. Environment & Tools
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] MongoDB running locally or cloud URI ready
- [ ] Redis running locally or cloud URI ready
- [ ] Azure Document Intelligence resource created
- [ ] Azure DI endpoint and API key obtained

### 2. Project Setup
- [ ] Clone/navigate to project: `c:\Users\NANDAKISHOR\Desktop\reportmind-ai`
- [ ] Navigate to backend: `cd backend`
- [ ] Install dependencies: `npm install`

### 3. Environment Configuration
Create `backend/.env` file with:
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reportmind-ai
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
AZURE_DI_ENDPOINT=https://YOUR-REGION.api.cognitive.microsoft.com/
AZURE_DI_KEY=YOUR-KEY
```

### 4. Dependencies Check
Verify these packages are installed in `package.json`:
- [ ] express
- [ ] mongoose
- [ ] bullmq
- [ ] @langchain/langgraph
- [ ] @azure/ai-form-recognizer
- [ ] multer
- [ ] cors
- [ ] dotenv

### 5. Services Running
- [ ] MongoDB: `mongod` (or verify cloud connection)
- [ ] Redis: `redis-server` (or verify cloud connection)
- [ ] Azure services: Verify endpoint is accessible

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install & Start
```bash
cd backend
npm install
npm run dev
```

### Step 2: Test Health Check
```bash
curl http://localhost:3000/health
# Should return: { "status": "OK", "service": "ReportMind AI Backend" }
```

### Step 3: Upload a Test PDF
```bash
# Use any PDF file
curl -X POST http://localhost:3000/api/v1/reports/upload \
  -F "file=@YOUR_PDF.pdf" \
  -H "Authorization: Bearer testuser:testorg:test@example.com"

# Note the reportId from response
```

### Step 4: Monitor Processing
```bash
# Check status immediately (should be PROCESSING)
curl http://localhost:3000/api/v1/reports/{reportId}/status

# Wait 10-30 seconds, then check again until COMPLETED
```

### Step 5: Retrieve Results
```bash
# Get full extracted data
curl http://localhost:3000/api/v1/reports/{reportId}
```

---

## 📊 What to Expect

### Logs During Processing
```
🚀 Starting report processing job: job-123 for report: report-1704564000000
📋 Initial state prepared for report report-1704564000000
🔄 Executing report graph pipeline...
✅ IngestionAgent started with file: /path/to/file.pdf
📄 Azure DI pages: 15
📊 Azure DI tables: 3
🏗️ StructureUnderstandingAgent analyzing document structure...
✅ Identified 8 document sections
🔍 DomainInferenceAgent inferring document domains...
✅ Detected domains: finance, esg
📈 MetricDiscoveryAgent discovering metrics...
✅ Discovered 32 metrics
📊 TableExtractionAgent processing tables...
✅ Processed and enriched 3 tables
📝 NarrativeExtractionAgent extracting narrative content...
✅ Extracted 12 narrative blocks
📌 FootnoteAgent extracting footnotes and references...
✅ Extracted 5 footnotes
✓ ValidationAgent validating extracted data...
✅ Validation complete. Issues: 1, Confidence: 87.5%
💡 InsightAgent generating insights...
✅ Generated 6 insights
✅ Graph execution completed for report report-1704564000000
💾 Persisting results to database...
✅ Report processing completed successfully: report-1704564000000
```

### Sample API Response
```json
{
  "report": {
    "_id": "report-1704564000000",
    "fileName": "sample.pdf",
    "fileUrl": "/uploads/reports/sample.pdf",
    "status": "COMPLETED",
    "totalPages": 15,
    "detectedDomains": ["finance", "esg"],
    "createdAt": "2026-01-06T10:00:00.000Z"
  },
  "summary": {
    "sectionsCount": 8,
    "tablesCount": 3,
    "metricsCount": 32,
    "narrativesCount": 12
  },
  "data": {
    "sections": [ /* Sample sections */ ],
    "tables": [ /* Sample tables */ ],
    "metrics": [ /* Top 10 metrics */ ],
    "narratives": [ /* Sample narratives */ ]
  }
}
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED localhost:27017` | Start MongoDB: `mongod` |
| `ECONNREFUSED localhost:6379` | Start Redis: `redis-server` |
| `Azure endpoint not found` | Check `.env` AZURE_DI_* variables |
| `PDF file only` validation error | Use actual PDF file, not text files |
| `Job marked as FAILED` | Check backend logs for error details |
| `No pages extracted` | Verify PDF is supported by Azure DI |
| `Port already in use` | Change PORT in `.env` or kill process on port 3000 |

---

## 📈 Next Development Sessions

### Session 2: Frontend & Dashboard
- [ ] Create React dashboard
- [ ] Display report list with status
- [ ] Show extracted metrics and insights
- [ ] Add report upload UI
- [ ] Add search and filter

### Session 3: Authentication & Permissions
- [ ] Implement JWT auth
- [ ] Add user login/signup
- [ ] Add organization management
- [ ] Add role-based permissions
- [ ] Add API key management

### Session 4: Production Deployment
- [ ] Docker containerization
- [ ] Kubernetes manifests
- [ ] Cloud deployment (AWS/Azure/GCP)
- [ ] Monitoring & alerting setup
- [ ] Performance optimization

---

## 🎯 Key Files to Review

1. **Agent Logic**: `backend/src/agents/`
2. **API Endpoints**: `backend/src/api/reports/report.controller.ts`
3. **Pipeline Config**: `backend/src/graph/report.graph.ts`
4. **Worker Setup**: `backend/src/workers/report.worker.ts`
5. **Database Models**: `backend/src/models/`

---

## 💡 Code Generation Examples

### Add New Agent
```typescript
import { AgentFn } from "./base.agent";

export const MyNewAgent: AgentFn = async (state) => {
  console.log("🆕 MyNewAgent processing...");
  
  // Process state data
  state.myData = "processed";
  
  console.log("✅ MyNewAgent complete");
  return state;
};
```

### Add New API Endpoint
```typescript
export const myNewEndpoint = async (req: Request, res: Response) => {
  try {
    // Your logic here
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
```

---

**You're all set! Start the dev server and begin testing. 🚀**
