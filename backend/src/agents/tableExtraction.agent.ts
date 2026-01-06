import { AgentFn } from "./base.agent";

interface ExtractedTable {
  pageNumber: number;
  rowCount: number;
  columnCount: number;
  headers: string[];
  rows: string[][];
  summary: string;
}

export const TableExtractionAgent: AgentFn = async (state) => {
  console.log("📊 TableExtractionAgent processing tables...");

  const processedTables: ExtractedTable[] = [];

  if (state.tables && state.tables.length > 0) {
    for (const table of state.tables) {
      const grid: string[][] = [];

      // Build grid from cells
      if (table.cells) {
        table.cells.forEach((cell: any) => {
          if (!grid[cell.rowIndex]) grid[cell.rowIndex] = [];
          grid[cell.rowIndex][cell.columnIndex] = cell.content || "";
        });
      }

      // Fill empty cells
      const maxRows = grid.length;
      const maxCols = Math.max(...grid.map((row: any) => row?.length || 0));

      for (let i = 0; i < maxRows; i++) {
        if (!grid[i]) grid[i] = [];
        for (let j = 0; j < maxCols; j++) {
          if (grid[i][j] === undefined) grid[i][j] = "";
        }
      }

      // Extract headers (first row typically)
      const headers = grid[0] ? grid[0].map((h: string) => h.trim()) : [];

      // Extract data rows
      const rows = grid.slice(1).map((row: string[]) =>
        row.map((cell: string) => cell.trim())
      );

      // Create summary
      const hasNumericData = rows.some((row: string[]) =>
        row.some((cell: string) => /^\d+(?:\.?\d+)?$/.test(cell))
      );

      const summary = `Table with ${rows.length} rows, ${maxCols} columns. ${
        hasNumericData ? "Contains numeric data." : ""
      }`;

      processedTables.push({
        pageNumber: table.pageNumber || 1,
        rowCount: rows.length,
        columnCount: maxCols,
        headers,
        rows,
        summary
      });
    }
  }

  state.tables = processedTables;

  console.log(
    `✅ Processed and enriched ${processedTables.length} tables`
  );

  return state;
};
