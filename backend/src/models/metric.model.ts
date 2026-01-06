import { Schema, model } from "mongoose";

const MetricSchema = new Schema({
  name: { type: String, required: true },
  aliases: [String],
  domain: { type: String },
  dataType: {
    type: String,
    enum: ["number", "percentage", "string"]
  }
});

export default model("Metric", MetricSchema);
