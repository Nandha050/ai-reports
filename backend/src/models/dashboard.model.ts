import { Schema, model } from "mongoose";

const DashboardSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: "Report", required: true },
  layoutConfig: { type: Object },
  charts: [{ type: Object }]
},
{ timestamps: true });

export default model("Dashboard", DashboardSchema);
