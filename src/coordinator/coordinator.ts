import {
  runDestinationAgent,
  runActivityAgent,
  runTransportAgent,
  destinationFallback,
  activityFallback,
  transportFallback
} from "../agents";

import { withTimeout, runWithRetry } from "../utils/agentWrapper";
import type { ItineraryResult } from "../types";

const AGENT_TIMEOUT = 5000;

export async function runCoordinator(input: any): Promise<ItineraryResult> {
  const conflicts: string[] = [];

  // Destination
  let destinationRes: any;
  let destinationFallbackUsed = false;

  try {
    const { result, attempts } = await runWithRetry(
      () => withTimeout(runDestinationAgent(input), AGENT_TIMEOUT),
      1
    );
    destinationRes = { ...result, metadata: { ...result.metadata, attempts } };
  } catch {
    destinationFallbackUsed = true;
    destinationRes = {
      choice: destinationFallback(),
      score: 0.3,
      reasoning: "Destination fallback used",
      metadata: { fallback: true }
    };
  }

  // Activities + Transport in parallel
  let activitiesRes: any;
  let transportRes: any;

  try {
    const [a, t] = await Promise.all([
      runWithRetry(() => withTimeout(runActivityAgent(destinationRes.choice), AGENT_TIMEOUT), 1),
      runWithRetry(() => withTimeout(runTransportAgent(destinationRes.choice), AGENT_TIMEOUT), 1)
    ]);

    activitiesRes = { ...a.result, metadata: { ...a.result.metadata, attempts: a.attempts } };
    transportRes = { ...t.result, metadata: { ...t.result.metadata, attempts: t.attempts } };
  } catch {
    activitiesRes = {
      choice: activityFallback(),
      score: 0.3,
      reasoning: "Activity fallback used",
      metadata: { fallback: true }
    };

    transportRes = {
      choice: transportFallback(),
      score: 0.3,
      reasoning: "Transport fallback used",
      metadata: { fallback: true }
    };
  }

  // Conflict resolution
  if (destinationRes.choice === "Goa" && transportRes.choice !== "Flight") {
    conflicts.push("Transport conflict, retrying once");
    try {
      transportRes = (await runTransportAgent(destinationRes.choice)) as any;
    } catch {
      transportRes = {
        choice: transportFallback(),
        score: 0.2,
        reasoning: "Transport fallback after conflict",
        metadata: { fallback: true }
      };
    }
  }


  return {
    destination: destinationRes.choice,
    activities: activitiesRes.choice,
    transport: transportRes.choice,
    reasoningTrace: {
      destination: destinationRes,
      activities: activitiesRes,
      transport: transportRes,
      ...(conflicts.length && { conflicts })
    }
  };
}
