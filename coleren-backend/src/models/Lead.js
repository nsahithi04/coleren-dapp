import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
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

    representativeName: {
      type: String,
    },

    status: {
      type: String,
      enum: ["NEW", "IN PROGRESS", "CLOSED"],
      default: "NEW",
    },

    outcome: {
      type: String,
      enum: ["WIN", "LOSS"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Lead", leadSchema);
