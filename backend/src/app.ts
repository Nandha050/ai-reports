import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./api/reports/report.routes";
import { optionalAuthMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Optional auth for all routes
app.use(optionalAuthMiddleware);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", service: "ReportMind AI Backend" });
});

// API routes
app.use("/api/v1/auth", (_req, res) => res.status(200).json({ message: "Auth API - Coming soon" }));
app.use("/api/v1/orgs", (_req, res) => res.status(200).json({ message: "Org API - Coming soon" }));
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/jobs", (_req, res) => res.status(200).json({ message: "Jobs API - Coming soon" }));
app.use("/api/v1/reviews", (_req, res) => res.status(200).json({ message: "Reviews API - Coming soon" }));
app.use("/api/v1/dashboards", (_req, res) => res.status(200).json({ message: "Dashboards API - Coming soon" }));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;

