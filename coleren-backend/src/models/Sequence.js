import mongoose from "mongoose";

const sequenceSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    type: String,
    rules: {},
  },
  { timestamps: true },
);

export default mongoose.model("Sequence", sequenceSchema);
