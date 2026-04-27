import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    jobTitle: String,

    workType: String,

    teamSize: String,

    subscribed: {
      type: Boolean,
      default: false,
    },

    onboarding: {
      connectorAdded: { type: Boolean, default: false },
      teamInvited: { type: Boolean, default: false },
      sequenceCreated: { type: Boolean, default: false },
      surveySent: { type: Boolean, default: false },
      aiChatUsed: { type: Boolean, default: false },
      feedbackReceived: { type: Boolean, default: false },
    },
    settings: {
      features: {
        multipleReleaseGroups: { type: Boolean, default: false },
        productSpecificFields: { type: Boolean, default: false },
        enableReportsForEditors: { type: Boolean, default: false },
      },
      feedbacks: {
        surveysAdminOnly: { type: Boolean, default: false },
        newSurveysAllMembers: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Profile", profileSchema);
