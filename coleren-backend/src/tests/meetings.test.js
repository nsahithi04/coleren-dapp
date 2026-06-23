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
const { default: Meeting } = await import("../models/Meetings.js");

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

// Patches createdAt directly, bypassing Mongoose's auto-managed timestamps
// (timestamps:true ignores createdAt passed into .create()).
async function createMeetingAt(fields, createdAt) {
  const meeting = await Meeting.create(fields);
  if (createdAt) {
    await Meeting.collection.updateOne(
      { _id: meeting._id },
      { $set: { createdAt } },
    );
  }
  return Meeting.findById(meeting._id);
}

describe("GET /api/meetings", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).get("/api/meetings");
    expect(res.status).toBe(401);
  });

  it("returns 404 when the authenticated user does not exist in DB", async () => {
    const res = await request(app)
      .get("/api/meetings")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns an empty array when user has no meetings", async () => {
    await seedUser();

    const res = await request(app)
      .get("/api/meetings")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns meetings sorted by createdAt descending (newest first)", async () => {
    const user = await seedUser();

    await createMeetingAt(
      { userId: user._id, company: "Oldest Co", meetingType: "SALES CALL" },
      new Date("2025-01-01"),
    );
    await createMeetingAt(
      { userId: user._id, company: "Newest Co", meetingType: "SALES CALL" },
      new Date("2026-01-01"),
    );
    await createMeetingAt(
      { userId: user._id, company: "Middle Co", meetingType: "REP INTERVIEW" },
      new Date("2025-06-01"),
    );

    const res = await request(app)
      .get("/api/meetings")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body.map((m) => m.company)).toEqual([
      "Newest Co",
      "Middle Co",
      "Oldest Co",
    ]);
  });

  it("limits results to 5 most recent meetings", async () => {
    const user = await seedUser();
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      await createMeetingAt(
        {
          userId: user._id,
          company: `Company ${i}`,
          meetingType: "SALES CALL",
        },
        new Date(now.getTime() - i * 1000 * 60 * 60), // each 1 hour apart
      );
    }

    const res = await request(app)
      .get("/api/meetings")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
    // most recent (i=0) should be first
    expect(res.body[0].company).toBe("Company 0");
  });

  it("includes representativeName, product, company, meetingType, and time", async () => {
    const user = await seedUser();

    const meeting = await createMeetingAt(
      {
        userId: user._id,
        representativeName: "Jane Rep",
        company: "Acme",
        product: "Coleren",
        meetingType: "REP INTERVIEW",
      },
      new Date("2026-03-15"),
    );

    const res = await request(app)
      .get("/api/meetings")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({
      _id: meeting._id.toString(),
      representativeName: "Jane Rep",
      company: "Acme",
      product: "Coleren",
      meetingType: "REP INTERVIEW",
    });
    expect(new Date(res.body[0].time).toISOString()).toBe(
      meeting.createdAt.toISOString(),
    );
  });

  it("does not return a 'timestamp' field, only 'time' derived from createdAt", async () => {
    const user = await seedUser();
    await Meeting.create({
      userId: user._id,
      company: "Acme",
      meetingType: "SALES CALL",
    });

    const res = await request(app)
      .get("/api/meetings")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body[0].time).toBeDefined();
    expect(res.body[0].timestamp).toBeUndefined();
  });

  it("only returns the authenticated user's own meetings", async () => {
    const user = await seedUser();
    const otherUser = await seedUser({
      firebaseUid: "other-uid",
      email: "other@example.com",
      name: "Other User",
    });

    await Meeting.create({
      userId: user._id,
      company: "Mine",
      meetingType: "SALES CALL",
    });
    await Meeting.create({
      userId: otherUser._id,
      company: "NotMine",
      meetingType: "SALES CALL",
    });

    const res = await request(app)
      .get("/api/meetings")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].company).toBe("Mine");
  });
});
