import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    representativeName: {
      type: String,
    },

    company: {
      type: String,
    },

    product: {
      type: String,
    },

    meetingType: {
      type: String,
      enum: ["REP INTERVIEW", "SALES CALL"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Meeting", meetingSchema);
