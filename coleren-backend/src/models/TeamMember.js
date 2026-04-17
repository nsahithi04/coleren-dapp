import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: String,
    permissions: [String],
  },
  { timestamps: true },
);

export default mongoose.model("TeamMember", teamMemberSchema);
