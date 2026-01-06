import { Schema, model } from "mongoose";

const UnclassifiedDataSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  rawContent: { type: String, required: true },
  pageNumber: { type: Number },
  reason: { type: String }
});

export default model("UnclassifiedData", UnclassifiedDataSchema);
