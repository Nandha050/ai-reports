import { AgentFn } from "./base.agent";

interface DiscoveredMetric {
  name: string;
  value: string | number;
  unit: string;
  pageNumber: number;
  context: string;
}

export const MetricDiscoveryAgent: AgentFn = async (state) => {
  console.log("📈 MetricDiscoveryAgent discovering metrics...");

  const metrics: DiscoveredMetric[] = [];

  // Extract numeric values with context
  const numberRegex = /(\d+\.?\d*)\s*([%€$£¥₹]*)\s*([a-zA-Z]*)/g;
  const keyMetricPatterns = [
    /(?:revenue|sales|turnover)[\s:]*\$?\d+(?:,\d+)*(?:\.\d+)?/gi,
    /(?:profit|earnings|ebitda)[\s:]*\$?\d+(?:,\d+)*(?:\.\d+)?/gi,
    /(?:margin|rate)[\s:]*\d+(?:,\d+)*\.?\d*\s*%/gi,
    /(?:growth|increase)[\s:]*\d+(?:,\d+)*\.?\d*\s*%/gi,
    /(?:capacity|production)[\s:]*\d+(?:,\d+)*(?:\.\d+)?/gi,
    /(?:market share|penetration)[\s:]*\d+(?:,\d+)*\.?\d*\s*%/gi
  ];

  // Scan pages for metrics
  if (state.pages) {
    for (const page of state.pages) {
      const text = page.text || "";

      for (const pattern of keyMetricPatterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          const metricText = match[0].trim();
          const context = text
            .substring(
              Math.max(0, match.index! - 50),
              Math.min(text.length, match.index! + metricText.length + 50)
            )
            .trim();

          metrics.push({
            name: metricText.split(/[\s:]/)[0],
            value: metricText,
            unit: "",
            pageNumber: page.pageNumber || 1,
            context: context
          });
        }
      }
    }
  }

  // Also extract from tables
  if (state.tables) {
    for (const table of state.tables) {
      const cells = table.cells || [];
      for (const cell of cells) {
        if (/^\d+(?:\.?\d+)?/.test(cell.content)) {
          metrics.push({
            name: `table_value_${metrics.length}`,
            value: cell.content,
            unit: "",
            pageNumber: table.pageNumber || 1,
            context: `Table cell [${cell.rowIndex}, ${cell.columnIndex}]`
          });
        }
      }
    }
  }

  // Deduplicate similar metrics
  const deduplicatedMetrics = metrics.slice(0, 50); // Limit to avoid noise

  state.metrics = deduplicatedMetrics;

  console.log(`✅ Discovered ${deduplicatedMetrics.length} metrics`);

  return state;
};
