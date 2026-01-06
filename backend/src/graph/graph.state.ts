import { Types } from "mongoose";

export interface GraphState {
  reportId: string;
  filePath: string;

  pages: any[];

  sections: any[];
  tables: any[];
  narratives: any[];
  footnotes: any[];

  domains: string[];
  metrics: any[];

  extractedValues: any[];
  unclassifiedData: any[];

  validationIssues: any[];
  insights?: any[];
  confidenceScore: number;

  retryCount: number;
}
