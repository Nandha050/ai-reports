import { Schema, model } from "mongoose";

const OrganizationMemberSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["ADMIN", "ANALYST", "VIEWER"],
    required: true
  },
  joinedAt: { type: Date, default: Date.now }
});

export default model("OrganizationMember", OrganizationMemberSchema);
