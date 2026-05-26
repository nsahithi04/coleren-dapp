import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    surveyId: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
    },

    salesRepName: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    industryType: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },

    surveyLink: {
      type: String,
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

    additionalComments: {
      type: String,
    },

    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Survey", surveySchema);
