import DocumentSection from "../models/documentSection.model";
import Table from "../models/table.model";
import NarrativeBlock from "../models/narrativeBlock.model";
import Footnote from "../models/footnote.model";
import Metric from "../models/metric.model";
import ExtractedValue from "../models/extractedValue.model";
import UnclassifiedData from "../models/unclassifiedData.model";
import Report from "../models/report.model";
import AgentRun from "../models/agentRun.model";

export const persistGraphOutput = async (
  reportId: string,
  state: any
) => {
    console.log("🧪 Persist called with:", {
  tables: state.tables?.length,
  sections: state.sections?.length,
  pages: state.pages?.length
});
  if (state.sections?.length) {
    await DocumentSection.insertMany(
      state.sections.map((s: any) => ({ ...s, reportId }))
    );
  }

  if (state.tables?.length) {
    await Table.insertMany(
      state.tables.map((t: any) => ({ ...t, reportId }))
    );
  }

  if (state.narratives?.length) {
    await NarrativeBlock.insertMany(
      state.narratives.map((n: any) => ({ ...n, reportId }))
    );
  }

  if (state.footnotes?.length) {
    await Footnote.insertMany(
      state.footnotes.map((f: any) => ({ ...f, reportId }))
    );
  }

  if (state.metrics?.length) {
    await Metric.insertMany(state.metrics);
  }

  if (state.extractedValues?.length) {
    await ExtractedValue.insertMany(
      state.extractedValues.map((v: any) => ({ ...v, reportId }))
    );
  }

  if (state.unclassifiedData?.length) {
    await UnclassifiedData.insertMany(
      state.unclassifiedData.map((u: any) => ({ ...u, reportId }))
    );
  }

  await Report.updateOne(
  { _id: reportId },
  { $set: { status: "COMPLETED" } }
);

  await AgentRun.create({
    reportJobId: reportId,
    agentName: "LangGraphPipeline",
    outputSummary: "Persisted all extracted artifacts",
    confidenceScore: state.confidenceScore
  });
};
