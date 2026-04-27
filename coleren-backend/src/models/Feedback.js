import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    client: {
      type: String,
      required: true,
    },

    salesRep: {
      type: String,
    },

    type: {
      type: String,
      enum: ["SALES REP", "CALL SUMMARY"],
      required: true,
    },

    phase: {
      type: String,
      enum: ["NEW", "IN PROGRESS", "CLOSED"],
      default: "NEW",
    },

    outcome: {
      type: String,
      enum: ["WIN", "LOSS", "TBD"],
      default: "TBD",
    },

    positives: [
      {
        type: String,
      },
    ],

    negatives: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Feedback", feedbackSchema);
