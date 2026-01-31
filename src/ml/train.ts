import * as tf from "@tensorflow/tfjs";
import fs from "fs";
import path from "path";
import { generateDataset } from "./datasetGenerator";

const MODEL_PATH = path.resolve("model/model.json");

async function train() {
  const data = generateDataset(600);

  const xs = tf.tensor2d(data.map(d => [d.budget / 800, d.prefersBeach]));
  const ys = tf.oneHot(tf.tensor1d(data.map(d => d.label), "int32"), 3);

  const model = tf.sequential();

  model.add(tf.layers.dense({ inputShape: [2], units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "categoricalCrossentropy"
  });

  await model.fit(xs, ys, {
    epochs: 20,
    batchSize: 32,
    verbose: 0
  });

  const artifacts = await model.save(tf.io.withSaveHandler(async a => ({
    modelArtifactsInfo: {
      dateSaved: new Date(),
      modelTopologyType: 'JSON',
      modelTopologyBytes: 0,
      weightSpecsBytes: 0,
      weightDataBytes: 0
    }
  })));

  if (!fs.existsSync("model")) fs.mkdirSync("model");

  fs.writeFileSync(MODEL_PATH, JSON.stringify(artifacts));

  console.log("Model saved to model/model.json");
}

train();
