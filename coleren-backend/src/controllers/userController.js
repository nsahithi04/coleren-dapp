import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, fromGoogle } = req.body;

    const firebaseUid = req.user.uid;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        name,
        email,
        fromGoogle,
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await User.findOne({ firebaseUid });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
