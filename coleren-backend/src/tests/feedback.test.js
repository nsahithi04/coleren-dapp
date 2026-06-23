import { jest } from "@jest/globals";
import request from "supertest";
import { startDB, stopDB, clearDB } from "./setup.js";

// Mock Firebase Admin before importing app
jest.unstable_mockModule("../config/firebase.js", () => ({
  default: {
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: "test-firebase-uid",
        email: "test@example.com",
      }),
    }),
  },
}));

const { default: app } = await import("../app.js");
const { default: User } = await import("../models/User.js");
const { default: Feedback } = await import("../models/Feedback.js");

beforeAll(() => startDB());
afterAll(() => stopDB());
afterEach(() => clearDB());

const AUTH_HEADER = ["Authorization", "Bearer fake-token"];

async function seedUser(overrides = {}) {
  return User.create({
    firebaseUid: "test-firebase-uid",
    email: "test@example.com",
    name: "Test User",
    ...overrides,
  });
}

describe("GET /api/feedback", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).get("/api/feedback");
    expect(res.status).toBe(401);
  });

  it("returns 404 when the authenticated user does not exist in DB", async () => {
    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns an empty array when user has no feedback", async () => {
    await seedUser();

    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all feedback for the user when no type filter is given", async () => {
    const user = await seedUser();

    await Feedback.create([
      { userId: user._id, client: "Acme", type: "SALES REP" },
      { userId: user._id, client: "Globex", type: "CALL SUMMARY" },
    ]);

    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("filters by type when a specific type is given", async () => {
    const user = await seedUser();

    await Feedback.create([
      { userId: user._id, client: "Acme", type: "SALES REP" },
      { userId: user._id, client: "Globex", type: "CALL SUMMARY" },
      { userId: user._id, client: "Initech", type: "SALES REP" },
    ]);

    const res = await request(app)
      .get("/api/feedback")
      .query({ type: "SALES REP" })
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((f) => f.type === "SALES REP")).toBe(true);
  });

  it("treats type=ALL the same as no filter", async () => {
    const user = await seedUser();

    await Feedback.create([
      { userId: user._id, client: "Acme", type: "SALES REP" },
      { userId: user._id, client: "Globex", type: "CALL SUMMARY" },
    ]);

    const res = await request(app)
      .get("/api/feedback")
      .query({ type: "ALL" })
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns an empty array when the type filter matches nothing", async () => {
    const user = await seedUser();

    await Feedback.create({
      userId: user._id,
      client: "Acme",
      type: "SALES REP",
    });

    const res = await request(app)
      .get("/api/feedback")
      .query({ type: "CALL SUMMARY" })
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("sorts results by createdAt descending (newest first)", async () => {
    const user = await seedUser();

    const older = await Feedback.create({
      userId: user._id,
      client: "Older",
      type: "SALES REP",
    });
    await Feedback.collection.updateOne(
      { _id: older._id },
      { $set: { createdAt: new Date("2025-01-01") } },
    );

    const newer = await Feedback.create({
      userId: user._id,
      client: "Newer",
      type: "SALES REP",
    });
    await Feedback.collection.updateOne(
      { _id: newer._id },
      { $set: { createdAt: new Date("2026-01-01") } },
    );

    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body[0].client).toBe("Newer");
    expect(res.body[1].client).toBe("Older");
  });

  it("includes positives, negatives, phase, and outcome in the response", async () => {
    const user = await seedUser();

    await Feedback.create({
      userId: user._id,
      client: "Acme",
      salesRep: "Jane Rep",
      type: "SALES REP",
      phase: "IN PROGRESS",
      outcome: "WIN",
      positives: ["Responsive support"],
      negatives: ["Slow turnaround"],
    });

    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({
      client: "Acme",
      salesRep: "Jane Rep",
      type: "SALES REP",
      phase: "IN PROGRESS",
      outcome: "WIN",
      positives: ["Responsive support"],
      negatives: ["Slow turnaround"],
    });
  });

  it("applies default phase and outcome when not provided", async () => {
    const user = await seedUser();

    await Feedback.create({
      userId: user._id,
      client: "Acme",
      type: "CALL SUMMARY",
    });

    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body[0].phase).toBe("NEW");
    expect(res.body[0].outcome).toBe("TBD");
  });

  it("only returns the authenticated user's own feedback", async () => {
    const user = await seedUser();
    const otherUser = await seedUser({
      firebaseUid: "other-uid",
      email: "other@example.com",
      name: "Other User",
    });

    await Feedback.create({
      userId: user._id,
      client: "Mine",
      type: "SALES REP",
    });
    await Feedback.create({
      userId: otherUser._id,
      client: "NotMine",
      type: "SALES REP",
    });

    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].client).toBe("Mine");
  });
});
