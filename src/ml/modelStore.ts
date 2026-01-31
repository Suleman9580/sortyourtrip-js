import * as tf from "@tensorflow/tfjs";
import fs from "fs";
import path from "path";

const MODEL_PATH = path.resolve("model/model.json");

let model: tf.LayersModel | null = null;

export async function loadModel() {
  if (model) return model;

  const artifacts = JSON.parse(fs.readFileSync(MODEL_PATH, "utf8"));

  model = await tf.loadLayersModel({
    load: async () => artifacts
  } as any);

  return model;
}

export async function predictDestination(budget: number, prefersBeach: number) {
  const m = await loadModel();

  const input = tf.tensor2d([[budget / 800, prefersBeach]]);
  const prediction = m.predict(input) as tf.Tensor;

  return Array.from(await prediction.data());
}
