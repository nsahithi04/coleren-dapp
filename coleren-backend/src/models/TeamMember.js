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
      required: true,
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
  },
  { timestamps: true },
);

export default mongoose.model("TeamMember", teamMemberSchema);
