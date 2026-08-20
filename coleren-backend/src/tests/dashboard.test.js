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
const { default: Lead } = await import("../models/Lead.js");
const { default: Product } = await import("../models/Product.js");

beforeAll(() => startDB());
afterAll(() => stopDB());
afterEach(() => clearDB());

const AUTH_HEADER = ["Authorization", "Bearer fake-token"];

async function seedUser() {
  return User.create({
    firebaseUid: "test-firebase-uid",
    email: "test@example.com",
    name: "Test User",
  });
}

async function createLeadAt(fields, createdAt) {
  const lead = await Lead.create(fields);
  if (createdAt) {
    await Lead.collection.updateOne({ _id: lead._id }, { $set: { createdAt } });
  }
  return Lead.findById(lead._id);
}

describe("POST /api/dashboard", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/dashboard").send({});
    expect(res.status).toBe(401);
  });

  it("returns 404 when the authenticated user does not exist in DB", async () => {
    const res = await request(app)
      .get("/api/feedback")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns all-zero stats when user has no leads or products", async () => {
    await seedUser();

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.product).toEqual({
      productMarketScore: 0,
      competitorScore: 0,
      conversionRate: 0,
    });
    expect(res.body.sales).toEqual({ totalLeads: 0, convertedLeads: 0 });
    expect(res.body.monthly.leads.current).toBe(0);
    expect(res.body.monthly.leads.growth).toBe(0);
    expect(res.body.monthly.converted.current).toBe(0);
    expect(res.body.monthly.converted.growth).toBe(0);
    expect(res.body.avgConversionsPerRep).toBe(0);
    expect(res.body.details.yearlyStats).toHaveLength(12);
  });

  it("computes conversion rate and totals across leads", async () => {
    const user = await seedUser();

    await Lead.create([
      { userId: user._id, client: "Acme", outcome: "WIN" },
      { userId: user._id, client: "Globex", outcome: "WIN" },
      { userId: user._id, client: "Initech", outcome: "LOSS" },
      { userId: user._id, client: "Umbrella" },
    ]);

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.sales.totalLeads).toBe(4);
    expect(res.body.sales.convertedLeads).toBe(2);
    expect(res.body.product.conversionRate).toBe(50);
  });

  it("averages product scores across multiple products", async () => {
    const user = await seedUser();

    await Product.create([
      {
        userId: user._id,
        name: "Coleren",
        productMarketFitScore: 80,
        competitorScore: 60,
      },
      {
        userId: user._id,
        name: "ADvantage",
        productMarketFitScore: 40,
        competitorScore: 20,
      },
    ]);

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.product.productMarketScore).toBe(60);
    expect(res.body.product.competitorScore).toBe(40);
  });

  it("separates this-month leads from last-month leads and computes growth", async () => {
    const user = await seedUser();
    const now = new Date();

    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 5);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 5);

    await createLeadAt({ userId: user._id, client: "A" }, thisMonth);
    await createLeadAt({ userId: user._id, client: "B" }, thisMonth);
    await createLeadAt({ userId: user._id, client: "C" }, thisMonth);
    await createLeadAt({ userId: user._id, client: "D" }, thisMonth);
    await createLeadAt({ userId: user._id, client: "E" }, lastMonth);
    await createLeadAt({ userId: user._id, client: "F" }, lastMonth);

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.monthly.leads.current).toBe(4);
    expect(res.body.monthly.leads.growth).toBe(100);
  });

  it("computes conversion growth between this month and last month", async () => {
    const user = await seedUser();
    const now = new Date();

    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 10);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 10);

    await createLeadAt(
      { userId: user._id, client: "A", outcome: "WIN" },
      thisMonth,
    );
    await createLeadAt(
      { userId: user._id, client: "B", outcome: "WIN" },
      thisMonth,
    );
    await createLeadAt(
      { userId: user._id, client: "C", outcome: "WIN" },
      lastMonth,
    );

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.monthly.converted.current).toBe(2);
    expect(res.body.monthly.converted.growth).toBe(100);
  });

  it("computes average conversions per rep for the current month", async () => {
    const user = await seedUser();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);

    // Rep A: 2 leads, 2 WIN. Rep B: 2 leads, 0 WIN.
    // avgConversionsPerRep = (2 converted total) / (2 reps) = 1
    await createLeadAt(
      {
        userId: user._id,
        client: "A",
        representativeName: "Rep A",
        outcome: "WIN",
      },
      thisMonth,
    );
    await createLeadAt(
      {
        userId: user._id,
        client: "B",
        representativeName: "Rep A",
        outcome: "WIN",
      },
      thisMonth,
    );
    await createLeadAt(
      {
        userId: user._id,
        client: "C",
        representativeName: "Rep B",
        outcome: "LOSS",
      },
      thisMonth,
    );
    await createLeadAt(
      { userId: user._id, client: "D", representativeName: "Rep B" },
      thisMonth,
    );

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.avgConversionsPerRep).toBe(1);
  });

  it("groups leads without a representativeName under 'Unknown'", async () => {
    const user = await seedUser();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 12);

    await createLeadAt(
      { userId: user._id, client: "A", outcome: "WIN" },
      thisMonth,
    );
    await createLeadAt({ userId: user._id, client: "B" }, thisMonth);

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.avgConversionsPerRep).toBe(1);
  });

  it("buckets leads into the correct month in yearlyStats", async () => {
    const user = await seedUser();
    const now = new Date();

    const januaryThisYear = new Date(now.getFullYear(), 0, 15);

    await createLeadAt(
      { userId: user._id, client: "A", outcome: "WIN" },
      januaryThisYear,
    );
    await createLeadAt({ userId: user._id, client: "B" }, januaryThisYear);

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    const januaryStats = res.body.details.yearlyStats.find(
      (m) => m.month === "Jan",
    );
    expect(januaryStats.leads).toBe(2);
    expect(januaryStats.converted).toBe(1);
  });

  it("limits detail arrays to 10 entries", async () => {
    const user = await seedUser();

    const docs = Array.from({ length: 15 }, (_, i) => ({
      userId: user._id,
      client: `Client ${i}`,
      outcome: "WIN",
    }));
    await Lead.create(docs);

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.details.leads).toHaveLength(10);
    expect(res.body.details.totalLeadsConverted).toHaveLength(10);
  });

  it("only includes the authenticated user's own leads and products", async () => {
    const user = await seedUser();
    const otherUser = await User.create({
      firebaseUid: "other-uid",
      email: "other@example.com",
      name: "Other User",
    });
    await Lead.create({ userId: user._id, client: "Mine", outcome: "WIN" });
    await Lead.create({
      userId: otherUser._id,
      client: "NotMine",
      outcome: "WIN",
    });

    const res = await request(app)
      .post("/api/dashboard")
      .set(...AUTH_HEADER)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.sales.totalLeads).toBe(1);
  });
});
