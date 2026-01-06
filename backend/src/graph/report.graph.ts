import { StateGraph } from "@langchain/langgraph";
import { GraphState } from "./graph.state";

import { IngestionAgent } from "../agents/ingestion.agent";
import { StructureUnderstandingAgent } from "../agents/structure.agent";
import { DomainInferenceAgent } from "../agents/domain.agent";
import { MetricDiscoveryAgent } from "../agents/metricDiscovery.agent";
import { TableExtractionAgent } from "../agents/tableExtraction.agent";
import { NarrativeExtractionAgent } from "../agents/narrative.agent";
import { FootnoteAgent } from "../agents/footnote.agent";
import { ValidationAgent } from "../agents/validation.agent";
import { InsightAgent } from "../agents/insight.agent";

export const reportGraph = new StateGraph<GraphState>({
  channels: {
    reportId: null,
    filePath: null,

    pages: null,
    sections: null,
    tables: null,
    narratives: null,
    footnotes: null,

    domains: null,
    metrics: null,

    extractedValues: null,
    unclassifiedData: null,

    validationIssues: null,
    insights: null,
    confidenceScore: null,
    retryCount: null
  }
})
  .addNode("Ingestion", IngestionAgent)
  .addNode("Structure", StructureUnderstandingAgent)
  .addNode("Domain", DomainInferenceAgent)
  .addNode("Metrics", MetricDiscoveryAgent)
  .addNode("Tables", TableExtractionAgent)
  .addNode("Narratives", NarrativeExtractionAgent)
  .addNode("Footnotes", FootnoteAgent)
  .addNode("Validation", ValidationAgent)
  .addNode("Insight", InsightAgent)

  .addEdge("Ingestion", "Structure")
  .addEdge("Structure", "Domain")
  .addEdge("Domain", "Metrics")
  .addEdge("Metrics", "Tables")
  .addEdge("Tables", "Narratives")
  .addEdge("Narratives", "Footnotes")
  .addEdge("Footnotes", "Validation")
  .addEdge("Validation", "Insight")

  .setEntryPoint("Ingestion")
  .setFinishPoint("Insight");
