import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },

    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["sales_call", "rep_interview"],
    },

    date: Date,
    duration: Number,
    score: Number,

    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Meeting", meetingSchema);
