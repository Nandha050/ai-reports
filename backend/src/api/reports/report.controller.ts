import { Request, Response } from "express";
import { reportQueue } from "../../queues/report.queue";
import Report from "../../models/report.model";
import DocumentSection from "../../models/documentSection.model";
import Table from "../../models/table.model";
import Metric from "../../models/metric.model";
import NarrativeBlock from "../../models/narrativeBlock.model";

export const uploadReport = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    // Validate file is PDF
    if (req.file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ message: "Only PDF files are allowed" });
    }

    const filePath = req.file.path;

    // Get user info from auth context or use defaults for testing
    const uploadedBy = req.user?.userId || "000000000000000000000001"; // Default test user
    const orgId = req.user?.orgId || "000000000000000000000001"; // Default test org

    // Create initial report record - let MongoDB generate _id
    const report = await Report.create({
      fileName: req.file.originalname,
      fileUrl: filePath,
      uploadedBy,
      orgId,
      status: "UPLOADED"
    });

    // Enqueue job with MongoDB _id
    const job = await reportQueue.add("process-report", {
      reportId: report._id.toString(),
      filePath
    });

    res.status(202).json({
      reportId: report._id,
      jobId: job.id,
      status: "UPLOADED",
      fileName: req.file.originalname
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Failed to upload report", error: error.message });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const report = await Report.findById(reportId).lean();

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Fetch related data
    const sections = await DocumentSection.find({ reportId }).lean();
    const tables = await Table.find({ reportId }).lean();
    const metrics = await Metric.find({ reportId }).lean();
    const narratives = await NarrativeBlock.find({ reportId }).lean();

    res.status(200).json({
      report,
      summary: {
        sectionsCount: sections.length,
        tablesCount: tables.length,
        metricsCount: metrics.length,
        narrativesCount: narratives.length
      },
      data: {
        sections: sections.slice(0, 5), // Sample
        tables: tables.slice(0, 3), // Sample
        metrics: metrics.slice(0, 10), // Sample
        narratives: narratives.slice(0, 3) // Sample
      }
    });
  } catch (error: any) {
    console.error("Get report error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch report", error: error.message });
  }
};

export const listReports = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Report.countDocuments(query);

    res.status(200).json({
      data: reports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error("List reports error:", error);
    res
      .status(500)
      .json({ message: "Failed to list reports", error: error.message });
  }
};

export const getReportStatus = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const report = await Report.findById(reportId).lean();

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      reportId,
      status: report.status,
      createdAt: report.createdAt,
      fileName: report.fileName
    });
  } catch (error: any) {
    console.error("Get report status error:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch report status",
        error: error.message
      });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Delete related data
    await DocumentSection.deleteMany({ reportId });
    await Table.deleteMany({ reportId });
    await Metric.deleteMany({ reportId });
    await NarrativeBlock.deleteMany({ reportId });

    res.status(200).json({
      message: "Report deleted successfully",
      reportId
    });
  } catch (error: any) {
    console.error("Delete report error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete report", error: error.message });
  }
};
