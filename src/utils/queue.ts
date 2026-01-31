import { Queue } from "bullmq";
import { redis } from "./redis";

export const itineraryQueue = new Queue("itineraries", {
  connection: redis
});
