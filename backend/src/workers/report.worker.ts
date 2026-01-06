import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { REPORT_QUEUE_NAME } from "../queues/report.queue";
import { reportGraph } from "../graph/report.graph";
import { ReportJobPayload } from "../types/reportJobPayload";
import { persistGraphOutput } from "../services/persistence.service";
import Report from "../models/report.model";

const MAX_RETRIES = 3;

const worker = new Worker<ReportJobPayload>(
  REPORT_QUEUE_NAME,
  async (job) => {
    const { reportId, filePath } = job.data;

    try {
      console.log(`\n🚀 Starting report processing job: ${job.id} for report: ${reportId}`);

      // Update report status
      await Report.findByIdAndUpdate(reportId, { status: "PROCESSING" });

      const initialState: any = {
        reportId,
        filePath,

        pages: [],
        sections: [],
        tables: [],
        narratives: [],
        footnotes: [],

        domains: [],
        metrics: [],

        extractedValues: [],
        unclassifiedData: [],

        validationIssues: [],
        confidenceScore: 0,
        retryCount: job.attemptsMade || 0
      };

      console.log(`📋 Initial state prepared for report ${reportId}`);

      const executor = reportGraph.compile();

      console.log(`🔄 Executing report graph pipeline...`);
      const finalState: any = await executor.invoke(initialState);

      console.log(`✅ Graph execution completed for report ${reportId}`);
      const pageCount = Array.isArray(finalState.pages) ? finalState.pages.length : 0;
      const sectionCount = Array.isArray(finalState.sections) ? finalState.sections.length : 0;
      const tableCount = Array.isArray(finalState.tables) ? finalState.tables.length : 0;
      const metricCount = Array.isArray(finalState.metrics) ? finalState.metrics.length : 0;
      const narrativeCount = Array.isArray(finalState.narratives) ? finalState.narratives.length : 0;

      console.log(`📊 Final state summary:
        - Pages: ${pageCount}
        - Sections: ${sectionCount}
        - Tables: ${tableCount}
        - Metrics: ${metricCount}
        - Narratives: ${narrativeCount}
        - Confidence: ${((finalState.confidenceScore || 0) * 100).toFixed(1)}%`);

      // Persist results
      console.log(`💾 Persisting results to database...`);
      await persistGraphOutput(reportId, finalState);

      // Update report status to completed
      await Report.findByIdAndUpdate(reportId, {
        status: "COMPLETED",
        totalPages: pageCount,
        detectedDomains: finalState.domains || []
      });

      console.log(`✅ Report processing completed successfully: ${reportId}\n`);

      return {
        reportId,
        status: "COMPLETED",
        confidenceScore: finalState.confidenceScore,
        extractedValuesCount: Array.isArray(finalState.extractedValues)
          ? finalState.extractedValues.length
          : 0,
        metricsCount: metricCount,
        sectionsCount: sectionCount,
        tablesCount: tableCount
      };
    } catch (error: any) {
      console.error(`❌ Error processing report ${reportId}:`, error.message);

      // Update report status to failed
      await Report.findByIdAndUpdate(reportId, {
        status: "FAILED",
        error: error.message
      });

      throw error;
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 2
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(
    `❌ Job failed: ${job?.id} - Attempts: ${job?.attemptsMade || 0}/${MAX_RETRIES}`
  );
  console.error(`   Error: ${err.message}`);

  if ((job?.attemptsMade || 0) >= MAX_RETRIES) {
    console.error(`❌ Max retries reached for job ${job?.id}`);
  }
});

worker.on("error", (err) => {
  console.error("❌ Worker error:", err);
});

worker.on("stalled", (jobId) => {
  console.warn(`⚠️ Job stalled: ${jobId}`);
});

worker.on("progress", (job, progress) => {
  console.log(`📈 Job ${job.id} progress: ${progress}%`);
});

export default worker;
