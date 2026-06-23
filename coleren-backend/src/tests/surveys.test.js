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

// Mock email sending so tests never attempt real network calls
jest.unstable_mockModule("../emails/sendMail.js", () => ({
  sendTemplateEmail: jest.fn().mockResolvedValue(true),
}));

const { default: app } = await import("../app.js");
const { default: User } = await import("../models/User.js");
const { default: Survey } = await import("../models/Survey.js");
const { sendTemplateEmail } = await import("../emails/sendMail.js");

beforeAll(() => startDB());
afterAll(() => stopDB());
afterEach(() => {
  jest.clearAllMocks();
  return clearDB();
});

const AUTH_HEADER = ["Authorization", "Bearer fake-token"];

async function seedUser() {
  return User.create({
    firebaseUid: "test-firebase-uid",
    email: "test@example.com",
    name: "Test User",
  });
}

describe("POST /api/survey/create", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/survey/create").send({});
    expect(res.status).toBe(401);
  });

  it("returns 404 when user does not exist in DB", async () => {
    const res = await request(app)
      .post("/api/survey/create")
      .set(...AUTH_HEADER)
      .send({
        customerName: "Sahithi Nampally",
        customerEmail: "sahithi@example.com",
        productName: "Coleren",
        salesRepName: "Jane Rep",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 400 when required fields are missing", async () => {
    await seedUser();

    const res = await request(app)
      .post("/api/survey/create")
      .set(...AUTH_HEADER)
      .send({
        customerName: "Sahithi Nampally",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required fields");
  });

  it("creates a survey and returns a survey link", async () => {
    await seedUser();

    const res = await request(app)
      .post("/api/survey/create")
      .set(...AUTH_HEADER)
      .send({
        customerName: "Sahithi Nampally",
        customerEmail: "sahithi@example.com",
        productName: "Coleren",
        salesRepName: "Jane Rep",
        industryType: "SaaS",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Survey created successfully");
    expect(res.body.surveyId).toMatch(/^SVY_/);
    expect(res.body.surveyLink).toContain(res.body.surveyId);
    expect(res.body.survey.status).toBe("PENDING");
    expect(res.body.survey.customerEmail).toBe("sahithi@example.com");

    const inDb = await Survey.findOne({ surveyId: res.body.surveyId });
    expect(inDb).not.toBeNull();
    expect(inDb.customerName).toBe("Sahithi Nampally");
  });
});

describe("POST /api/survey (send survey email)", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/survey").send({});
    expect(res.status).toBe(401);
  });

  it("sends an email to each recipient and returns success", async () => {
    const res = await request(app)
      .post("/api/survey")
      .set(...AUTH_HEADER)
      .send({
        content: {
          recipients: ["a@example.com", "b@example.com"],
          subject: "Survey Invitation",
          body: "<p>Hi there</p>",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Emails sent successfully");
    expect(sendTemplateEmail).toHaveBeenCalledTimes(2);
    expect(sendTemplateEmail).toHaveBeenCalledWith({
      to: "a@example.com",
      type: "CUSTOM",
      data: {
        body: "<p>Hi there</p>",
        subject: "Survey Invitation",
      },
    });
  });

  it("returns 500 when email sending throws", async () => {
    sendTemplateEmail.mockRejectedValueOnce(new Error("SMTP down"));

    const res = await request(app)
      .post("/api/survey")
      .set(...AUTH_HEADER)
      .send({
        content: {
          recipients: ["a@example.com"],
          subject: "Survey Invitation",
          body: "<p>Hi there</p>",
        },
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to send emails");
  });
});

describe("GET /api/survey/:surveyId", () => {
  it("returns 404 for a survey that does not exist", async () => {
    const res = await request(app).get("/api/survey/SVY_doesnotexist");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Survey not found");
  });

  it("returns the survey with no auth required", async () => {
    const user = await seedUser();
    const survey = await Survey.create({
      userId: user._id,
      surveyId: "SVY_abc123",
      customerName: "Sahithi Nampally",
      customerEmail: "sahithi@example.com",
      productName: "Coleren",
      salesRepName: "Jane Rep",
      status: "PENDING",
    });

    const res = await request(app).get(`/api/survey/${survey.surveyId}`);

    expect(res.status).toBe(200);
    expect(res.body.surveyId).toBe("SVY_abc123");
    expect(res.body.customerEmail).toBe("sahithi@example.com");
  });
});

describe("POST /api/survey/submit/:surveyId", () => {
  it("returns 404 for a survey that does not exist", async () => {
    const res = await request(app)
      .post("/api/survey/submit/SVY_doesnotexist")
      .send({ positives: [], negatives: [], additionalComments: "" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Survey not found");
  });

  it("submits a pending survey successfully", async () => {
    const user = await seedUser();
    const survey = await Survey.create({
      userId: user._id,
      surveyId: "SVY_def456",
      customerName: "Sahithi Nampally",
      customerEmail: "sahithi@example.com",
      productName: "Coleren",
      salesRepName: "Jane Rep",
      status: "PENDING",
    });

    const res = await request(app)
      .post(`/api/survey/submit/${survey.surveyId}`)
      .send({
        positives: ["Great support"],
        negatives: ["Slow onboarding"],
        additionalComments: "Overall happy",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Survey submitted successfully");

    const updated = await Survey.findOne({ surveyId: "SVY_def456" });
    expect(updated.status).toBe("COMPLETED");
    expect(updated.positives).toEqual(["Great support"]);
    expect(updated.negatives).toEqual(["Slow onboarding"]);
    expect(updated.submittedAt).not.toBeNull();
  });

  it("returns 400 when survey is already completed", async () => {
    const user = await seedUser();
    const survey = await Survey.create({
      userId: user._id,
      surveyId: "SVY_ghi789",
      customerName: "Sahithi Nampally",
      customerEmail: "sahithi@example.com",
      productName: "Coleren",
      salesRepName: "Jane Rep",
      status: "COMPLETED",
    });

    const res = await request(app)
      .post(`/api/survey/submit/${survey.surveyId}`)
      .send({ positives: [], negatives: [], additionalComments: "" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Survey has already been submitted");
  });
});
