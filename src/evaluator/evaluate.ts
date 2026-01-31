import fs from "fs";
import path from "path";
import { generateDataset } from "../ml/datasetGenerator";
import { predictDestination } from "../ml/modelStore";
import { temperatureScale } from "../ml/calibration";

const LABELS = ["Goa", "Manali", "Jaipur"];

function baseline(sample: any) {
  if (sample.prefersBeach && sample.budget > 400) return 0;
  if (sample.budget < 300) return 1;
  return 2;
}

async function evaluate() {
  const data = generateDataset(300);

  let mlCorrect = 0;
  let baseCorrect = 0;
  let avgConfidence = 0;

  for (const d of data) {
    // ML
    const raw = await predictDestination(d.budget, d.prefersBeach);
    const calibrated = temperatureScale(raw, 1.5);

    const mlPred = calibrated.indexOf(Math.max(...calibrated));
    if (mlPred === d.label) mlCorrect++;

    avgConfidence += Math.max(...calibrated);

    // Baseline
    const basePred = baseline(d);
    if (basePred === d.label) baseCorrect++;
  }

  const mlAccuracy = mlCorrect / data.length;
  const baselineAccuracy = baseCorrect / data.length;
  const avgConf = avgConfidence / data.length;

  const report = {
    samples: data.length,
    mlAccuracy,
    baselineAccuracy,
    avgConfidence: avgConf
  };

  if (!fs.existsSync("reports")) fs.mkdirSync("reports");

  fs.writeFileSync(
    path.resolve("reports/eval.json"),
    JSON.stringify(report, null, 2)
  );

  console.log("Evaluation complete:");
  console.table(report);
}

evaluate();
