import { Schema, model } from "mongoose";

const ReportJobSchema = new Schema(
  {
    reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
    status: {
      type: String,
      enum: ["QUEUED", "RUNNING", "FAILED", "COMPLETED"],
      default: "QUEUED"
    },
    currentStage: { type: String },
    retryCount: { type: Number, default: 0 },
    errorMessage: { type: String },
    startedAt: { type: Date },
    finishedAt: { type: Date }
  },
  { timestamps: true }
);

export default model("ReportJob", ReportJobSchema);
