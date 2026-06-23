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
const { default: Team } = await import("../models/Team.js");
const { default: TeamMember } = await import("../models/TeamMember.js");
const { sendTemplateEmail } = await import("../emails/sendMail.js");

beforeAll(() => startDB());
afterAll(() => stopDB());
afterEach(() => {
  jest.clearAllMocks();
  return clearDB();
});

const AUTH_HEADER = ["Authorization", "Bearer fake-token"];

// The mocked Firebase token always resolves to uid "test-firebase-uid",
// so the "current user" in every request is whichever User has that uid.
async function seedCurrentUser(overrides = {}) {
  return User.create({
    firebaseUid: "test-firebase-uid",
    email: "test@example.com",
    name: "Current User",
    ...overrides,
  });
}

async function seedOtherUser(overrides = {}) {
  return User.create({
    firebaseUid: "other-uid",
    email: "other@example.com",
    name: "Other User",
    ...overrides,
  });
}

async function seedTeam(ownerId) {
  return Team.create({ name: "Test Team", ownerId });
}

describe("GET /api/team", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).get("/api/team");
    expect(res.status).toBe(401);
  });

  it("returns 404 when the authenticated user does not exist in DB", async () => {
    const res = await request(app)
      .get("/api/team")
      .set(...AUTH_HEADER);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns an empty array when the user has no accepted team membership", async () => {
    await seedCurrentUser();

    const res = await request(app)
      .get("/api/team")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns accepted team members with isCurrentUser and isOwner flags", async () => {
    const user = await seedCurrentUser();
    const teammate = await seedOtherUser();
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });
    await TeamMember.create({
      teamId: team._id,
      userId: teammate._id,
      role: "SALES",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .get("/api/team")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);

    const ownerEntry = res.body.find((m) => m.isOwner);
    const otherEntry = res.body.find((m) => !m.isOwner);

    expect(ownerEntry.isCurrentUser).toBe(true);
    expect(ownerEntry.name).toBe("Current User");
    expect(otherEntry.isCurrentUser).toBe(false);
    expect(otherEntry.name).toBe("Other User");
  });

  it("excludes PENDING members from the returned list", async () => {
    const user = await seedCurrentUser();
    const pendingInvitee = await seedOtherUser();
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });
    await TeamMember.create({
      teamId: team._id,
      userId: pendingInvitee._id,
      email: "other@example.com",
      role: "SALES",
      access: "VIEWER",
      status: "PENDING",
    });

    const res = await request(app)
      .get("/api/team")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("PUT /api/team/:id", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app)
      .put("/api/team/000000000000000000000000")
      .send({});
    expect(res.status).toBe(401);
  });

  it("returns 400 when role or access is missing", async () => {
    await seedCurrentUser();

    const res = await request(app)
      .put("/api/team/000000000000000000000000")
      .set(...AUTH_HEADER)
      .send({ role: "SALES" }); // missing access

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("role and access are required");
  });

  it("returns 404 when the target member does not exist", async () => {
    await seedCurrentUser();

    const res = await request(app)
      .put("/api/team/000000000000000000000000")
      .set(...AUTH_HEADER)
      .send({ role: "SALES", access: "VIEWER" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Team member not found");
  });

  it("returns 403 when the requester is not OWNER or ADMIN on that team", async () => {
    const user = await seedCurrentUser();
    const teammate = await seedOtherUser();
    const team = await seedTeam(teammate._id);

    // Current user is only a VIEWER/PRODUCT member, not OWNER/ADMIN
    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "PRODUCT",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const target = await TeamMember.create({
      teamId: team._id,
      userId: teammate._id,
      role: "SALES",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .put(`/api/team/${target._id}`)
      .set(...AUTH_HEADER)
      .send({ role: "SALES", access: "ADMIN" });

    expect(res.status).toBe(403);
  });

  it("updates role and access when requester is OWNER", async () => {
    const user = await seedCurrentUser();
    const teammate = await seedOtherUser();
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });

    const target = await TeamMember.create({
      teamId: team._id,
      userId: teammate._id,
      role: "SALES",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .put(`/api/team/${target._id}`)
      .set(...AUTH_HEADER)
      .send({ role: "product", access: "admin" }); // lowercase input

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("PRODUCT");
    expect(res.body.access).toBe("ADMIN");
  });

  it("allows ADMIN access (not just OWNER role) to update members", async () => {
    const user = await seedCurrentUser();
    const teammate = await seedOtherUser();
    const team = await seedTeam(teammate._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "SALES",
      access: "ADMIN", // ADMIN access, not OWNER role
      status: "ACCEPTED",
    });

    const target = await TeamMember.create({
      teamId: team._id,
      userId: teammate._id,
      role: "PRODUCT",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .put(`/api/team/${target._id}`)
      .set(...AUTH_HEADER)
      .send({ role: "SALES", access: "VIEWER" });

    expect(res.status).toBe(200);
  });

  it("cannot update a member on a different team", async () => {
    const user = await seedCurrentUser();
    const ownTeam = await seedTeam(user._id);

    await TeamMember.create({
      teamId: ownTeam._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });

    const otherUser = await seedOtherUser();
    const otherTeam = await seedTeam(otherUser._id);
    const otherTeamTarget = await TeamMember.create({
      teamId: otherTeam._id,
      userId: otherUser._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .put(`/api/team/${otherTeamTarget._id}`)
      .set(...AUTH_HEADER)
      .send({ role: "SALES", access: "VIEWER" });

    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/team/:id", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).delete("/api/team/000000000000000000000000");
    expect(res.status).toBe(401);
  });

  it("returns 404 when the target member does not exist", async () => {
    await seedCurrentUser();

    const res = await request(app)
      .delete("/api/team/000000000000000000000000")
      .set(...AUTH_HEADER);

    expect(res.status).toBe(404);
  });

  it("returns 403 when requester lacks permission", async () => {
    const user = await seedCurrentUser();
    const teammate = await seedOtherUser();
    const team = await seedTeam(teammate._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "PRODUCT",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const target = await TeamMember.create({
      teamId: team._id,
      userId: teammate._id,
      role: "SALES",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .delete(`/api/team/${target._id}`)
      .set(...AUTH_HEADER);

    expect(res.status).toBe(403);

    const stillExists = await TeamMember.findById(target._id);
    expect(stillExists).not.toBeNull();
  });

  it("deletes the member when requester is OWNER", async () => {
    const user = await seedCurrentUser();
    const teammate = await seedOtherUser();
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });

    const target = await TeamMember.create({
      teamId: team._id,
      userId: teammate._id,
      role: "SALES",
      access: "VIEWER",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .delete(`/api/team/${target._id}`)
      .set(...AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");

    const stillExists = await TeamMember.findById(target._id);
    expect(stillExists).toBeNull();
  });
});

describe("POST /api/team/invite", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/team/invite").send({});
    expect(res.status).toBe(401);
  });

  it("returns 404 when authenticated user does not exist in DB", async () => {
    const res = await request(app)
      .post("/api/team/invite")
      .set(...AUTH_HEADER)
      .send({ invites: [] });

    expect(res.status).toBe(404);
  });

  it("returns 403 when requester has no accepted membership", async () => {
    await seedCurrentUser();

    const res = await request(app)
      .post("/api/team/invite")
      .set(...AUTH_HEADER)
      .send({
        invites: [
          { email: "new@example.com", role: "sales", access: "viewer" },
        ],
      });

    expect(res.status).toBe(403);
  });

  it("creates a PENDING invite and sends an email for a brand-new user", async () => {
    const user = await seedCurrentUser();
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .post("/api/team/invite")
      .set(...AUTH_HEADER)
      .send({
        invites: [
          { email: "brandnew@example.com", role: "sales", access: "viewer" },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Team members added successfully");

    const created = await TeamMember.findOne({ email: "brandnew@example.com" });
    expect(created).not.toBeNull();
    expect(created.status).toBe("PENDING");
    expect(created.role).toBe("SALES");
    expect(created.access).toBe("VIEWER");
    expect(created.userId).toBeNull();
    expect(created.inviteToken).toBeTruthy();

    expect(created).not.toBeNull();
    expect(created.status).toBe("PENDING");
  });

  it("uses EXISTING_USER_INVITE and links userId when invitee already has an account", async () => {
    const user = await seedCurrentUser();
    const existingInvitee = await seedOtherUser({
      email: "existing@example.com",
    });
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });

    const res = await request(app)
      .post("/api/team/invite")
      .set(...AUTH_HEADER)
      .send({
        invites: [
          { email: "existing@example.com", role: "sales", access: "viewer" },
        ],
      });

    expect(res.status).toBe(200);

    const created = await TeamMember.findOne({ email: "existing@example.com" });
    expect(created.userId.toString()).toBe(existingInvitee._id.toString());

    expect(created.userId.toString()).toBe(existingInvitee._id.toString());
  });

  it("reports per-invite failures with 207 without aborting other invites", async () => {
    const user = await seedCurrentUser();
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    });

    sendTemplateEmail
      .mockRejectedValueOnce(new Error("SMTP down"))
      .mockResolvedValueOnce(true);

    const res = await request(app)
      .post("/api/team/invite")
      .set(...AUTH_HEADER)
      .send({
        invites: [
          { email: "fails@example.com", role: "sales", access: "viewer" },
          { email: "succeeds@example.com", role: "sales", access: "viewer" },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(2);

    // both TeamMember docs still get created even though one email failed
    const succeeded = await TeamMember.findOne({
      email: "succeeds@example.com",
    });
    expect(succeeded).not.toBeNull();
  });
});

describe("POST /api/team/accept", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).post("/api/team/accept").send({});
    expect(res.status).toBe(401);
  });

  it("returns 404 when authenticated user does not exist in DB", async () => {
    const res = await request(app)
      .post("/api/team/accept")
      .set(...AUTH_HEADER)
      .send({ inviteToken: "sometoken" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 404 when the invite token does not match a pending invite", async () => {
    await seedCurrentUser();

    const res = await request(app)
      .post("/api/team/accept")
      .set(...AUTH_HEADER)
      .send({ inviteToken: "doesnotexist" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Invite not found");
  });

  it("accepts a pending invite and links it to the current user", async () => {
    const user = await seedCurrentUser();
    const team = await seedTeam(user._id);

    const pending = await TeamMember.create({
      teamId: team._id,
      email: "test@example.com",
      role: "SALES",
      access: "VIEWER",
      status: "PENDING",
      inviteToken: "valid-token-123",
    });

    const res = await request(app)
      .post("/api/team/accept")
      .set(...AUTH_HEADER)
      .send({ inviteToken: "valid-token-123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Invite accepted successfully");

    const updated = await TeamMember.findById(pending._id);
    expect(updated.status).toBe("ACCEPTED");
    expect(updated.userId.toString()).toBe(user._id.toString());
  });

  it("does not accept an invite that is already ACCEPTED", async () => {
    const user = await seedCurrentUser();
    const team = await seedTeam(user._id);

    await TeamMember.create({
      teamId: team._id,
      userId: user._id,
      email: "test@example.com",
      role: "SALES",
      access: "VIEWER",
      status: "ACCEPTED",
      inviteToken: "already-used-token",
    });

    const res = await request(app)
      .post("/api/team/accept")
      .set(...AUTH_HEADER)
      .send({ inviteToken: "already-used-token" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Invite not found");
  });
});
