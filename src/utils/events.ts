import { redis } from "./redis";

export const publishEvent = async (jobId: string, data: any) => {
  await redis.publish(`job:${jobId}`, JSON.stringify(data));
};

export const subscribeJob = (jobId: string, handler: (data: any) => void) => {
  const sub = redis.duplicate();
  sub.subscribe(`job:${jobId}`);

  sub.on("message", (_c: any, message: any) => {
    handler(JSON.parse(message));
  });

  return sub;
};
