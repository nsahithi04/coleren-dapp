import User from "../models/User.js";
import TeamMember from "../models/TeamMember.js";
import Team from "../models/Team.js";

export const getTeam = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const membership = await TeamMember.findOne({
      userId: user._id,
      status: "ACCEPTED",
    });

    if (!membership) {
      return res.json([]);
    }

    const members = await TeamMember.find({
      teamId: membership.teamId,
      status: "ACCEPTED",
    }).populate("userId");

    const result = members.map((m) => ({
      _id: m._id,
      isCurrentUser: m.userId._id.equals(user._id),
      userId: m.userId._id,
      name: m.userId.name,
      email: m.userId.email,
      role: m.role,
      access: m.access,
      isOwner: m.role === "OWNER",
    }));

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch team",
    });
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

export const inviteMember = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const currentUser = await User.findOne({
      firebaseUid,
    });

    const currentTeamMember = await TeamMember.findOne({
      userId: currentUser._id,
      status: "ACCEPTED",
    });

    const canManage =
      currentTeamMember?.role === "OWNER" ||
      currentTeamMember?.access === "ADMIN";

    if (!canManage) {
      return res.status(403).json({
        message: "Not enough permission to add team members",
      });
    }

    const invites = req.body.invites;

    for (const invite of invites) {
      const invitedUser = await User.findOne({
        email: invite.email,
      });

      if (!invitedUser) continue;

      await TeamMember.create({
        teamId: currentTeamMember.teamId,
        ownerId: currentTeamMember.ownerId,
        userId: invitedUser._id,
        role: invite.role.toUpperCase(),
        access: invite.access.toUpperCase(),
        status: "ACCEPTED",
      });
    }

    res.json({
      message: "Team members added successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to invite members",
    });
  }
};
