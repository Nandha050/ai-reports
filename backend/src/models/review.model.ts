import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
  extractedValueId: { type: Schema.Types.ObjectId, ref: "ExtractedValue", required: true },
  originalValue: { type: String },
  correctedValue: { type: String },
  reviewerId: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String },
  reviewedAt: { type: Date }
});

export default model("Review", ReviewSchema);
