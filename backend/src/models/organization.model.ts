import { Schema, model } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE"
    }
  },
  { timestamps: true }
);

export default model("Organization", OrganizationSchema);
