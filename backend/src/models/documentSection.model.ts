import { Schema, model } from "mongoose";

const DocumentSectionSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  title: { type: String, required: true },
  pageStart: { type: Number },
  pageEnd: { type: Number },
  sectionType: {
    type: String,
    enum: ["SUMMARY", "SEGMENT", "ANALYSIS", "FINANCIAL_STATEMENT", "NOTE"]
  }
});

export default model("DocumentSection", DocumentSectionSchema);
