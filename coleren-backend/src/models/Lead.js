import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    name: String,
    category: String,
    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    phase: {
      type: String,
      enum: ["converted", "progress", "lost"],
    },
    status: {
      type: String,
      enum: ["open", "closed"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Lead", leadSchema);
