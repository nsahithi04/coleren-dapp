import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["PRODUCT", "SALES"],
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
