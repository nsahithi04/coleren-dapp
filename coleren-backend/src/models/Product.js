import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    name: String,
    category: String,
    fit: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
