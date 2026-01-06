import { AgentFn } from "./base.agent";

interface ValidationIssue {
  type: string;
  severity: "critical" | "warning" | "info";
  message: string;
  affectedItems: string[];
}

export const ValidationAgent: AgentFn = async (state) => {
  console.log("✓ ValidationAgent validating extracted data...");

  const validationIssues: ValidationIssue[] = [];
  let confidenceScore = 1.0;

  // Validate pages
  if (!state.pages || state.pages.length === 0) {
    validationIssues.push({
      type: "missing_pages",
      severity: "critical",
      message: "No pages extracted from document",
      affectedItems: []
    });
    confidenceScore -= 0.3;
  }

  // Validate tables
  if (state.tables && state.tables.length > 0) {
    for (let i = 0; i < state.tables.length; i++) {
      const table = state.tables[i];
      if (!table.headers || table.headers.length === 0) {
        validationIssues.push({
          type: "incomplete_table",
          severity: "warning",
          message: `Table ${i} has no headers`,
          affectedItems: [`table_${i}`]
        });
        confidenceScore -= 0.05;
      }
      if (!table.rows || table.rows.length === 0) {
        validationIssues.push({
          type: "empty_table",
          severity: "warning",
          message: `Table ${i} has no data rows`,
          affectedItems: [`table_${i}`]
        });
        confidenceScore -= 0.05;
      }
    }
  }

  // Validate sections
  if (state.sections && state.sections.length > 0) {
    for (let i = 0; i < state.sections.length; i++) {
      const section = state.sections[i];
      if (!section.content || section.content.length < 10) {
        validationIssues.push({
          type: "minimal_content",
          severity: "info",
          message: `Section ${i} has minimal content`,
          affectedItems: [`section_${i}`]
        });
        confidenceScore -= 0.02;
      }
    }
  }

  // Validate metrics
  if (!state.metrics || state.metrics.length === 0) {
    validationIssues.push({
      type: "no_metrics",
      severity: "info",
      message: "No metrics discovered",
      affectedItems: []
    });
    confidenceScore -= 0.1;
  }

  // Validate domains
  if (!state.domains || state.domains.length === 0) {
    validationIssues.push({
      type: "unknown_domain",
      severity: "warning",
      message: "Document domain could not be determined",
      affectedItems: []
    });
    confidenceScore -= 0.15;
  }

  // Ensure confidence score is between 0 and 1
  confidenceScore = Math.max(0, Math.min(1, confidenceScore));

  state.validationIssues = validationIssues;
  state.confidenceScore = confidenceScore;

  console.log(
    `✅ Validation complete. Issues: ${validationIssues.length}, Confidence: ${(
      confidenceScore * 100
    ).toFixed(1)}%`
  );

  return state;
};
