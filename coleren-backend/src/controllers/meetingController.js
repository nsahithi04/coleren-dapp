import User from "../models/User.js";
import Meeting from "../models/Meetings.js";

export const getLatest = async (req, res) => {
  {
    try {
      const firebaseUid = req.user.uid;
      const user = await User.findOne({ firebaseUid });

      const meetings = await Meeting.find({
        userId: user._id,
      })
        .sort({ timestamp: -1 })
        .limit(5);

      const result = meetings.map((m) => ({
        _id: m._id,
        representativeName: m.representativeName,
        product: m.product,
        company: m.company,
        meetingType: m.meetingType,
        time: m.timestamp,
      }));

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  }
};
