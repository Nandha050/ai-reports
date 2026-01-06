import { AgentFn } from "./base.agent";

interface NarrativeBlock {
  sectionId: string;
  content: string;
  pageNumber: number;
  wordCount: number;
  sentiment: "positive" | "neutral" | "negative";
}

export const NarrativeExtractionAgent: AgentFn = async (state) => {
  console.log("📝 NarrativeExtractionAgent extracting narrative content...");

  const narratives: NarrativeBlock[] = [];

  // Extract narratives from sections
  if (state.sections && state.sections.length > 0) {
    for (let i = 0; i < state.sections.length; i++) {
      const section = state.sections[i];

      if (section.content && section.content.length > 20) {
        // Determine sentiment (simple heuristic)
        let sentiment: "positive" | "neutral" | "negative" = "neutral";
        const positiveWords = [
          "growth",
          "increase",
          "improvement",
          "success",
          "strong",
          "opportunity"
        ];
        const negativeWords = [
          "decline",
          "decrease",
          "risk",
          "challenge",
          "threat",
          "loss"
        ];

        const contentLower = section.content.toLowerCase();
        const positiveCount = positiveWords.filter((w) =>
          contentLower.includes(w)
        ).length;
        const negativeCount = negativeWords.filter((w) =>
          contentLower.includes(w)
        ).length;

        if (positiveCount > negativeCount) sentiment = "positive";
        else if (negativeCount > positiveCount) sentiment = "negative";

        narratives.push({
          sectionId: `section_${i}`,
          content: section.content,
          pageNumber: section.pageNumber || 1,
          wordCount: section.content.split(/\s+/).length,
          sentiment
        });
      }
    }
  }

  // Also extract narrative from pages if no sections were identified
  if (narratives.length === 0 && state.pages) {
    for (const page of state.pages) {
      if (page.text && page.text.length > 100) {
        narratives.push({
          sectionId: `page_${page.pageNumber}`,
          content: page.text,
          pageNumber: page.pageNumber || 1,
          wordCount: page.text.split(/\s+/).length,
          sentiment: "neutral"
        });
      }
    }
  }

  state.narratives = narratives;

  console.log(`✅ Extracted ${narratives.length} narrative blocks`);

  return state;
};
