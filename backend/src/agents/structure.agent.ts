import { AgentFn } from "./base.agent";

interface DocumentSection {
  pageNumber: number;
  heading: string;
  content: string;
  depth: number;
}

export const StructureUnderstandingAgent: AgentFn = async (state) => {
  console.log("🏗️ StructureUnderstandingAgent analyzing document structure...");

  const sections: DocumentSection[] = [];
  let sectionCounter = 0;

  // Process pages to identify sections and structure
  if (state.pages && state.pages.length > 0) {
    for (const page of state.pages) {
      const lines = page.text?.split("\n").filter((l: string) => l.trim()) || [];
      let currentSection: DocumentSection | null = null;

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Detect headings (uppercase, short lines)
        if (
          trimmedLine.length < 100 &&
          trimmedLine === trimmedLine.toUpperCase() &&
          trimmedLine.length > 5
        ) {
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            pageNumber: page.pageNumber || 1,
            heading: trimmedLine,
            content: "",
            depth: 1
          };
          sectionCounter++;
        } else if (currentSection && trimmedLine.length > 0) {
          currentSection.content += (currentSection.content ? " " : "") + trimmedLine;
        }
      }

      if (currentSection) {
        sections.push(currentSection);
      }
    }
  }

  // Update state with structured sections
  state.sections = sections;

  console.log(`✅ Identified ${sections.length} document sections`);
  console.log(`📊 Tables from ingestion: ${state.tables?.length || 0}`);

  return state;
};
