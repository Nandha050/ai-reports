import { AgentFn } from "./base.agent";

interface Insight {
  title: string;
  description: string;
  type: "metric" | "trend" | "comparison" | "anomaly" | "summary";
  priority: "high" | "medium" | "low";
  supportingData: string[];
}

export const InsightAgent: AgentFn = async (state) => {
  console.log("💡 InsightAgent generating insights...");

  const insights: Insight[] = [];

  // Generate insights from domains
  if (state.domains && state.domains.length > 0) {
    insights.push({
      title: "Document Classification",
      description: `This document is primarily focused on ${state.domains[0]} with secondary focus on ${
        state.domains[1] || "operations"
      }`,
      type: "summary",
      priority: "high",
      supportingData: state.domains
    });
  }

  // Generate insights from metrics
  if (state.metrics && state.metrics.length > 5) {
    insights.push({
      title: "Rich Quantitative Data",
      description: `Found ${state.metrics.length} quantitative metrics throughout the document, indicating strong data-driven reporting`,
      type: "metric",
      priority: "medium",
      supportingData: state.metrics.slice(0, 5).map((m: any) => m.name)
    });
  }

  // Generate insights from tables
  if (state.tables && state.tables.length > 0) {
    const largestTable = state.tables.reduce(
      (max: any, t: any) => (t.rowCount > max.rowCount ? t : max),
      state.tables[0]
    );

    insights.push({
      title: "Structured Data Present",
      description: `Document contains ${state.tables.length} tables with structured data. Largest table has ${largestTable.rowCount} rows.`,
      type: "metric",
      priority: "medium",
      supportingData: [`${state.tables.length} tables found`]
    });
  }

  // Generate insights from validation
  if (state.validationIssues && state.validationIssues.length > 0) {
    const criticalIssues = state.validationIssues.filter(
      (i: any) => i.severity === "critical"
    );

    if (criticalIssues.length > 0) {
      insights.push({
        title: "Data Quality Concerns",
        description: `Detected ${criticalIssues.length} critical issues that may affect data reliability`,
        type: "anomaly",
        priority: "high",
        supportingData: criticalIssues.map((i: any) => i.message)
      });
    }
  }

  // Generate confidence-based insight
  insights.push({
    title: "Extraction Confidence",
    description: `Processing confidence score: ${(state.confidenceScore * 100).toFixed(
      1
    )}%. ${
      state.confidenceScore > 0.8
        ? "Data extraction quality is high."
        : state.confidenceScore > 0.5
        ? "Some data quality issues detected."
        : "Multiple data quality concerns present."
    }`,
    type: "summary",
    priority: state.confidenceScore > 0.8 ? "low" : "high",
    supportingData: [state.confidenceScore.toFixed(2)]
  });

  // Generate narrative insights
  if (state.narratives && state.narratives.length > 0) {
    const positiveNarratives = state.narratives.filter(
      (n: any) => n.sentiment === "positive"
    ).length;
    const negativeNarratives = state.narratives.filter(
      (n: any) => n.sentiment === "negative"
    ).length;

    if (positiveNarratives > negativeNarratives) {
      insights.push({
        title: "Positive Sentiment Trend",
        description: `Narrative analysis suggests positive outlook with ${positiveNarratives} positive vs ${negativeNarratives} negative sections`,
        type: "trend",
        priority: "medium",
        supportingData: [
          `Positive: ${positiveNarratives}`,
          `Negative: ${negativeNarratives}`
        ]
      });
    }
  }

  // Store insights in state (for potential future display in dashboard)
  state.insights = insights;

  console.log(`✅ Generated ${insights.length} insights`);

  return state;
};
