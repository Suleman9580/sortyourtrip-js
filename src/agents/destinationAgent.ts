import type { AgentResult } from "../types";
import { predictDestination } from "../ml/modelStore";
import { temperatureScale } from "../ml/calibration";

const LABELS = ["Goa", "Manali", "Jaipur"];

function baselineDestination(input: any) {
  const budget = input?.budget ?? 500;
  const prefersBeach = input?.prefersBeach ?? false;

  if (prefersBeach && budget > 400) return "Goa";
  if (budget < 300) return "Manali";
  return "Jaipur";
}

export async function runDestinationAgent(input: any): Promise<AgentResult<string>> {
  const useBaseline = process.env.USE_BASELINE === "true";

  if (useBaseline) {
    const choice = baselineDestination(input);
    return {
      choice,
      score: 0.6,
      reasoning: "Baseline heuristic used",
      metadata: { baseline: true }
    };
  }

  const budget = input?.budget ?? 500;
  const prefersBeach = input?.prefersBeach ? 1 : 0;

  const rawProbs = await predictDestination(budget, prefersBeach);
  const calibrated = temperatureScale(rawProbs, 1.5);

  const maxIdx = calibrated.indexOf(Math.max(...calibrated));

  return {
    choice: LABELS[maxIdx] ?? '',
    score: calibrated[maxIdx] ?? 0,
    reasoning: `Raw=${JSON.stringify(rawProbs)} Calibrated=${JSON.stringify(calibrated)}`,
    metadata: {
      budget,
      prefersBeach,
      rawProbs,
      calibrated
    }
  };
}

export function destinationFallback(): string {
  return "Jaipur";
}
