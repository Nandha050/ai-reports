import { GraphState } from "../graph/graph.state";

export type AgentFn = (state: GraphState) => Promise<GraphState>;
