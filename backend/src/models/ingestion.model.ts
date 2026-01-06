import { Schema, model } from "mongoose";

const IngestionSchema = new Schema(
  {
    reportId: {
      type: String,
      required: true,
      index: true
    },

    isReadable: {
      type: Boolean,
      required: true
    },

    issues: {
      type: [String],
      default: []
    },

    totalPagesDetected: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model("IngestionResult", IngestionSchema);
