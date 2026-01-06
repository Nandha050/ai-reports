import { AgentFn } from "./base.agent";

export const ExtractionNormalizationAgent: AgentFn = async (state) => {
  state.extractedValues = [];
  state.unclassifiedData = [];
  return state;
};
