import { Router } from "express";
import {
  uploadReport,
  getReport,
  listReports,
  getReportStatus,
  deleteReport
} from "./report.controller";
import { reportUpload } from "../../services/fileUpload.service";

const router = Router();

// POST - Upload a new report
router.post(
  "/upload",
  reportUpload.single("file"),
  uploadReport
);

// GET - List all reports with pagination
router.get("/", listReports);

// GET - Get report by ID with extracted data
router.get("/:reportId", getReport);

// GET - Get report processing status
router.get("/:reportId/status", getReportStatus);

// DELETE - Delete report and related data
router.delete("/:reportId", deleteReport);

export default router;
