import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    productMarketFitScore: {
      type: Number,
      default: 0,
    },

    competitorScore: {
      type: Number,
      default: 0,
    },

    representativeName: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
