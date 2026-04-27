import User from "../models/User.js";
import TeamMember from "../models/TeamMember.js";

export const getTeam = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    const members = await TeamMember.find({
      $or: [{ ownerId: user._id }, { userId: user._id }],
      status: "ACCEPTED",
    }).populate("userId ownerId");

    const result = members.map((m) => ({
      _id: m._id,
      name: m.userId.name,
      email: m.userId.email,
      role: m.role,
      access: m.access,
      isOwner: m.ownerId._id.equals(user._id),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch team" });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await TeamMember.findByIdAndUpdate(
      id,
      {
        role: req.body.role.toUpperCase(),
        access: req.body.access.toUpperCase(),
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update member" });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    await TeamMember.findByIdAndDelete(id);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete member" });
  }
};
