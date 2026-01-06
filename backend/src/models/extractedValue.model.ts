import { Schema, model } from "mongoose";

const ExtractedValueSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  metricId: { type: Schema.Types.ObjectId, ref: "Metric", required: true },
  tableId: { type: Schema.Types.ObjectId, ref: "Table" },
  value: { type: Schema.Types.Mixed },
  unit: { type: String },
  period: { type: String },
  sourcePage: { type: Number },
  confidenceScore: { type: Number }
});

export default model("ExtractedValue", ExtractedValueSchema);
