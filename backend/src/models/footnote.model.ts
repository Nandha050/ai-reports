import { Schema, model } from "mongoose";

const FootnoteSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  referenceId: { type: String, required: true },
  text: { type: String, required: true },
  pageNumber: { type: Number }
});

export default model("Footnote", FootnoteSchema);
