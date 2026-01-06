import { Schema, model } from "mongoose";

const AuditLogSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: "Organization" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now }
});

export default model("AuditLog", AuditLogSchema);
