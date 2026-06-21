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

beforeAll(() => startDB());
afterAll(() => stopDB());
afterEach(() => clearDB());

describe("POST /api/users/login", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/users/login").send({});
    expect(res.status).toBe(401);
  });

  it("returns user null when user does not exist in DB", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .set("Authorization", "Bearer fake-token")
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.user).toBeNull();
    expect(res.body.onboarding).toBe(true);
  });
});

describe("POST /api/users/signup", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/users/signup").send({});
    expect(res.status).toBe(401);
  });
});

describe("GET /api/users/profile", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.status).toBe(401);
  });

  it("returns 404 when user does not exist in DB", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", "Bearer fake-token");
    expect(res.status).toBe(404);
  });
});
