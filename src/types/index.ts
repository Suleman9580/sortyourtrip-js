export interface AgentResult<T = any> {
  choice: T;
  score: number;
  reasoning: string;
  metadata: Record<string, any>;
}

export interface ItineraryResult {
  destination: string;
  activities: string[];
  transport: string;
  reasoningTrace: {
    destination: AgentResult;
    activities: AgentResult;
    transport: AgentResult;
    conflicts?: string[];
  };
}
