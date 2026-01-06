import { Schema, model } from "mongoose";

const NarrativeBlockSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: "DocumentSection" },
  relatedTableIds: [{ type: Schema.Types.ObjectId, ref: "Table" }],
  text: { type: String, required: true },
  pageNumber: { type: Number }
});

export default model("NarrativeBlock", NarrativeBlockSchema);
