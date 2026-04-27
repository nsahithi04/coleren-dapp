import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

export const getFeedback = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    const { type } = req.query;

    let filter = { userId: user._id };

    if (type && type !== "ALL") {
      filter.type = type;
    }

    const feedback = await Feedback.find(filter).sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};
