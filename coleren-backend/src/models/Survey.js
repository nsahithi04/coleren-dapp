import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["sent", "completed"],
    },

    responses: {},
  },
  { timestamps: true },
);

export default mongoose.model("Survey", surveySchema);
