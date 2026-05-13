import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    role: {
      type: String,
      enum: ["OWNER", "PRODUCT", "SALES"],
      required: true,
    },

    access: {
      type: String,
      enum: ["ADMIN", "VIEWER"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED"],
      default: "PENDING",
    },

    email: {
      type: String,
    },

    inviteToken: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("TeamMember", teamMemberSchema);
