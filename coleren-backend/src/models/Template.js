import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    type: String,
    content: {},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastEdited: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Template", templateSchema);
