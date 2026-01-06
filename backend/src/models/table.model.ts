import { Schema, model } from "mongoose";

const TableSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: "DocumentSection" },
  title: { type: String },
  pageNumber: { type: Number },
  columnHeaders: [[String]],
  rowHeaders: [String],
  rawGrid: [[String]],
  units: { type: String },
  timePeriods: [String]
});

export default model("Table", TableSchema);
