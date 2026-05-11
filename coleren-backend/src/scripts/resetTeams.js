import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("Connected to DB");

try {
  // =========================
  // DELETE OLD DATA
  // =========================

  await Team.deleteMany({});
  await TeamMember.deleteMany({});

  console.log("Old teams deleted");

  // =========================
  // GET USERS
  // =========================

  const sahithi = await User.findById("69e7f17cd34614a33fbea1f7");

  const abhiram = await User.findById("69e7f118d34614a33fbea1f5");

  if (!sahithi || !abhiram) {
    throw new Error("Users not found");
  }

  // =========================
  // CREATE TEAM
  // =========================

  const team = await Team.create({
    name: "Coleren Team",
    ownerId: sahithi._id,
  });

  console.log("Team created");

  // =========================
  // CREATE MEMBERS
  // =========================

  await TeamMember.create([
    {
      teamId: team._id,
      userId: sahithi._id,
      role: "OWNER",
      access: "ADMIN",
      status: "ACCEPTED",
    },

    {
      teamId: team._id,
      userId: abhiram._id,
      role: "SALES",
      access: "ADMIN",
      status: "ACCEPTED",
    },
  ]);

  console.log("Team members added");

  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
