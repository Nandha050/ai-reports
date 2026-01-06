import { AgentFn } from "./base.agent";

interface Footnote {
  referenceId: string;
  pageNumber: number;
  content: string;
  linkedMetrics: string[];
}

export const FootnoteAgent: AgentFn = async (state) => {
  console.log("📌 FootnoteAgent extracting footnotes and references...");

  const footnotes: Footnote[] = [];

  // Pattern to detect footnotes (superscript numbers, etc)
  const footnotePatterns = [
    /\[\d+\][^[\n]*/g, // [1] format
    /\*+[^*\n]*/g, // * format
    /^[0-9]+\.\s+.+$/gm // Numbered list
  ];

  // Extract footnotes from all pages
  if (state.pages) {
    for (const page of state.pages) {
      const text = page.text || "";

      for (const pattern of footnotePatterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          const footnoteText = match[0].trim();

          // Extract reference ID if present
          const refMatch = footnoteText.match(/[\[\*](\d+)/);
          const referenceId = refMatch ? refMatch[1] : `ref_${footnotes.length}`;

          // Link related metrics
          const linkedMetrics = state.metrics
            ?.filter((m: any) =>
              m.context.toLowerCase().includes(footnoteText.toLowerCase())
            )
            .map((m: any) => m.name) || [];

          footnotes.push({
            referenceId,
            pageNumber: page.pageNumber || 1,
            content: footnoteText,
            linkedMetrics
          });
        }
      }
    }
  }

  // Limit to avoid noise
  state.footnotes = footnotes.slice(0, 50);

  console.log(`✅ Extracted ${state.footnotes.length} footnotes`);

  return state;
};
