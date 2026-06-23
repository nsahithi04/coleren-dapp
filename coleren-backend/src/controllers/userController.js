import User from "../models/User.js";
import Profile from "../models/Profile.js";
import TeamMember from "../models/TeamMember.js";

export const getUser = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.json({
        user: null,
        profile: null,
        onboarding: true,
      });
    }

    const profile = await Profile.findOne({ userId: user._id });

    res.json({
      user,
      profile,
      onboarding: !profile?.onboarding ?? false,
    });
  } catch (err) {
    console.error("err", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, role, teamSize, workType, subscribed, fromGoogle } = req.body;

    console.log(req.body);

    const firebaseUid = req.user.uid;
    const email = req.user.email;

    let user = await User.findOne({ firebaseUid: firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid: firebaseUid,
        email,
        name,
        fromGoogle: fromGoogle ?? false,
      });
    }

    let profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      profile = await Profile.create({
        userId: user._id,
        firebaseUid: firebaseUid,
        jobTitle: role,
        teamSize,
        workType,
        subscribed,
      });
    }

    if (req.body.inviteToken) {
      const pendingInvite = await TeamMember.findOne({
        inviteToken: req.body.inviteToken,

        status: "PENDING",
      });

      if (pendingInvite) {
        pendingInvite.userId = user._id;

        pendingInvite.status = "ACCEPTED";

        await pendingInvite.save();
      }
    }

    return res.status(201).json({
      message: "User and profile created successfully",
      user,
      profile,
    });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = await Profile.findOne({ userId: user._id });

    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateOnboarding = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { key, value } = req.body;

    const user = await User.findOne({ firebaseUid });
    const profile = await Profile.findOne({ userId: user._id });

    profile.onboarding[key] = value;
    await profile.save();

    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    return res.json({
      exists: !!user,
    });
  } catch (err) {
    console.error("err", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const { name, role, workType, settings } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { $set: { name } },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const profileUpdates = {};

    if (role) profileUpdates.jobTitle = role;
    if (workType) profileUpdates.workType = workType;
    if (settings) profileUpdates.settings = settings;

    const profile = await Profile.findOneAndUpdate(
      { firebaseUid },
      { $set: profileUpdates },
      { returnDocument: "after" },
    );

    const mergedUser = {
      ...user.toObject(),
      role: profile?.jobTitle,
      workType: profile?.workType,
    };

    res.json(mergedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Update failed",
    });
  }
};
