export function temperatureScale(probs: number[], T = 1.5) {
  const logits = probs.map(p => Math.log(p + 1e-9));
  const scaled = logits.map(l => l / T);

  const exps = scaled.map(Math.exp);
  const sum = exps.reduce((a, b) => a + b, 0);

  return exps.map(v => v / sum);
}
