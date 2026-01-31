import express from "express";
import routes from "./routes";
import { logger } from "../utils/logger";
import "../workers/itineraryWorker";
import { register } from "../utils/metrics.js";
import rateLimit from "express-rate-limit";



const app = express();

app.use(express.json());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 60
}));

app.get("/health", (_req: any, res: any) => res.json({ status: "ok" }));

app.get("/metrics", async (_req: any, res: any) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use(routes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`API listening on port ${PORT}`);
});

export default app