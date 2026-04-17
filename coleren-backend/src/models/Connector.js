import mongoose from "mongoose";

const connectorSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    type: String,
    status: String,

    errors: [String],
    rules: {},
    fieldMaps: {},

    lastSynced: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Connector", connectorSchema);
