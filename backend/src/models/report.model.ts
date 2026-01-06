import { Schema, model } from "mongoose";

const ReportSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  totalPages: { type: Number },
  detectedDomains: [String],
  status: {
    type: String,
    enum: ["UPLOADED", "PROCESSING", "COMPLETED", "FAILED"],
    default: "UPLOADED"
  },
  createdAt: { type: Date, default: Date.now }
});

export default model("Report", ReportSchema);
