import type { AgentResult } from "../types";

export async function runTransportAgent(destination: string): Promise<AgentResult<string>> {
  let transport = "Train";

  if (destination === "Goa") transport = "Flight";
  if (destination === "Manali") transport = "Bus";

  return {
    choice: transport,
    score: 0.75,
    reasoning: `Transport estimated for ${destination}`,
    metadata: { destination }
  };
}


export function transportFallback(): string {
  return "Train";
}
