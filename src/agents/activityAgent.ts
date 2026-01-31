import type { AgentResult } from "../types";

export async function runActivityAgent(destination: string): Promise<AgentResult<string[]>> {
  let activities: string[] = [];

  if (destination === "Goa") activities = ["Beach", "Seafood"];
  if (destination === "Manali") activities = ["Hiking", "Snow"];
  if (destination === "Jaipur") activities = ["Fort Tour", "Street Food"];

  return {
    choice: activities,
    score: 0.8,
    reasoning: `Activities based on destination ${destination}`,
    metadata: { destination }
  };
}

export function activityFallback(): string[] {
  return ["City Walk"];
}
