import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const createOrUpdateProfile = async (req, res, next) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        firebaseUid,
        jobTitle: req.body.role,
        subscribed: req.body.subscribed,
        workType: req.body.workType,
        teamSize: req.body.teamSize,
        onboarding: {},
        settings: {},
      },
      { upsert: true, returnDocument: "after", runValidators: true },
    );

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await Profile.findOne({ userId: user._id });

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateOnboarding = async (req, res, next) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await User.findOne({ firebaseUid });

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          [`onboarding.${req.body.key}`]: req.body.value,
        },
      },
      { returnDocument: "after" },
    );

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const getSettings = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    const profile = await Profile.findOne({ userId: user._id });

    res.json(profile?.settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    const updateQuery = {};

    if (req.body.features) {
      for (const key in req.body.features) {
        updateQuery[`settings.features.${key}`] = req.body.features[key];
      }
    }

    if (req.body.feedbacks) {
      for (const key in req.body.feedbacks) {
        updateQuery[`settings.feedbacks.${key}`] = req.body.feedbacks[key];
      }
    }

    const updated = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: updateQuery },
      { new: true, upsert: true },
    );

    res.json(updated.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
