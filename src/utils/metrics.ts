import client from "prom-client";

export const jobsSubmitted = new client.Counter({
  name: "jobs_submitted",
  help: "Jobs submitted"
});

export const jobsCompleted = new client.Counter({
  name: "jobs_completed",
  help: "Jobs completed"
});

export const agentFailures = new client.Counter({
  name: "agent_failures",
  help: "Agent failures"
});

export const register = client.register;
