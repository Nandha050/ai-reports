import { Schema, model } from "mongoose";

const AgentRunSchema = new Schema({
  reportJobId: { type: Schema.Types.ObjectId, ref: "ReportJob", required: true },
  agentName: { type: String, required: true },
  inputSummary: { type: String },
  outputSummary: { type: String },
  confidenceScore: { type: Number },
  tokenUsage: { type: Number },
  durationMs: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default model("AgentRun", AgentRunSchema);
