import { AgentFn } from "./base.agent";
import { parsePdfWithAzureDI } from "../services/azureDocumentIntelligence.service";

export const IngestionAgent: AgentFn = async (state) => {
    console.log("🚀 IngestionAgent started with file:", state.filePath);

  const result = await parsePdfWithAzureDI(state.filePath);

  state.pages = result.pages?.map((page) => ({
    pageNumber: page.pageNumber,
    text: page.lines?.map((l) => l.content).join(" ")
  })) || [];

  state.tables = result.tables?.map((table) => ({
    pageNumber: table.boundingRegions?.[0]?.pageNumber,
    rowCount: table.rowCount,
    columnCount: table.columnCount,
    cells: table.cells.map((cell) => ({
      rowIndex: cell.rowIndex,
      columnIndex: cell.columnIndex,
      content: cell.content
    }))
  })) || [];
  console.log("📄 Azure DI pages:", result.pages?.length);
console.log("📊 Azure DI tables:", result.tables?.length);


  return state;
};
