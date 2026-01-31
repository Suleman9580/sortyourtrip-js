import request from "supertest";
import app from "../api/server";

describe("itinerary flow", () => {
  it("creates job", async () => {
    const res = await request(app)
      .post("/itineraries")
      .send({ budget: 600, prefersBeach: true });

    expect(res.body.jobId).toBeDefined();
  });
});
