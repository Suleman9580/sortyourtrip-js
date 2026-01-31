import { Router } from "express";
import { itineraryQueue } from "../utils/queue";
import { subscribeJob } from "../utils/events";
import { QueueEvents } from "bullmq";
import { redis } from "../utils/redis";
import { itinerarySchema } from "./validators.js";
import { jobsSubmitted } from "../utils/metrics.js";


const router = Router();

const queueEvents = new QueueEvents("itineraries", { connection: redis });

router.post("/itineraries", async (req, res) => {
  const parsed = itinerarySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const job = await itineraryQueue.add("create", parsed.data);

  jobsSubmitted.inc();
  res.json({ jobId: job.id });
});

router.get("/jobs/:id", async (req, res) => {
  const job = await itineraryQueue.getJob(req.params.id);

  if (!job) return res.status(404).json({ error: "Not found" });

  const state = await job.getState();

  res.json({
    status: state,
    progress: job.progress,
    result: job.returnvalue || null
  });
});

router.get("/jobs/:id/events", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sub = subscribeJob(req.params.id, (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  req.on("close", () => {
    sub.disconnect();
  });
});

export default router;
