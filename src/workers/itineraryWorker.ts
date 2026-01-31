import { Worker } from "bullmq";
import { redis } from "../utils/redis";
import { publishEvent } from "../utils/events";
import { logger } from "../utils/logger";
import { runCoordinator } from "../coordinator/coordinator";
import { jobsCompleted } from "../utils/metrics.js";


new Worker(
  "itineraries",
  async job => {
    const id = job.id as string;

    const emit = async (progress: number, step: string) => {
      await job.updateProgress(progress);
      await publishEvent(id, { progress, step });
    };

    await emit(5, "queue_accepted");

    await emit(20, "destination_running");

    const result = await runCoordinator(job.data || {});

    await emit(60, "activities_transport_done");

    await emit(100, "finalizing");

    jobsCompleted.inc();

    return result;
  },
  { connection: redis }
);

logger.info("Worker started");
