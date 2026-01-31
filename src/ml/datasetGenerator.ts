import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Sample {
  budget: number;
  prefersBeach: number;
  label: number;
}

// labels: 0=Goa, 1=Manali, 2=Jaipur

export function generateDataset(n = 500): Sample[] {
  const samples: Sample[] = [];

  for (let i = 0; i < n; i++) {
    const budget = Math.floor(Math.random() * 800);
    const prefersBeach = Math.random() > 0.5 ? 1 : 0;

    let label = 2; // Jaipur default

    if (prefersBeach && budget > 400) label = 0;
    else if (budget < 300) label = 1;

    samples.push({ budget, prefersBeach, label });
  }

  return samples;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = generateDataset(500);
  fs.writeFileSync("dataset.json", JSON.stringify(data, null, 2));
  console.log("dataset.json generated");
}
