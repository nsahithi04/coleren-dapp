import User from "../models/User.js";
import TeamMember from "../models/TeamMember.js";
import crypto from "crypto";
import { sendTemplateEmail } from "../emails/sendMail.js";

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

async function getManageableTargetMember(req, targetId) {
  const firebaseUid = req.user.uid;
  const currentUser = await User.findOne({ firebaseUid });

  if (!currentUser) {
    return { error: { status: 404, message: "User not found" } };
  }

  const targetMember = await TeamMember.findById(targetId);

  if (!targetMember) {
    return { error: { status: 404, message: "Team member not found" } };
  }

  const currentTeamMember = await TeamMember.findOne({
    userId: currentUser._id,
    teamId: targetMember.teamId,
    status: "ACCEPTED",
  });

  const canManage =
    currentTeamMember?.role === "OWNER" ||
    currentTeamMember?.access === "ADMIN";

  if (!canManage) {
    return {
      error: {
        status: 403,
        message: "Not enough permission to manage team members",
      },
    };
  }

  return { targetMember };
}

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, access } = req.body;

    if (!role || !access) {
      return res.status(400).json({
        message: "role and access are required",
      });
    }

    const { error, targetMember } = await getManageableTargetMember(req, id);

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    const updated = await TeamMember.findByIdAndUpdate(
      targetMember._id,
      {
        role: role.toUpperCase(),
        access: access.toUpperCase(),
      },
      { returnDocument: "after" },
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

    const { error, targetMember } = await getManageableTargetMember(req, id);

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    await TeamMember.findByIdAndDelete(targetMember._id);

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

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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
    const results = [];

    for (const invite of invites) {
      try {
        const invitedUser = await User.findOne({
          email: invite.email,
        });

        const token = crypto.randomBytes(32).toString("hex");

        const member = await TeamMember.create({
          teamId: currentTeamMember.teamId,
          userId: invitedUser?._id || null,
          email: invite.email,
          role: invite.role.toUpperCase(),
          access: invite.access.toUpperCase(),
          inviteToken: token,
          status: "PENDING",
        });

        let inviteLink = "";

        if (invitedUser) {
          inviteLink = `${process.env.FRONTEND_URL}/accept-invite?invite=${token}`;
        } else {
          inviteLink = `${process.env.FRONTEND_URL}/signup?invite=${token}`;
        }

        await sendTemplateEmail({
          to: invite.email,

          type: invitedUser ? "EXISTING_USER_INVITE" : "NEW_USER_INVITE",

          data: {
            inviteLink,

            inviterName: currentUser.name,
          },
        });

        results.push({ email: invite.email, status: "sent" });
      } catch (inviteErr) {
        console.error(`Failed to invite ${invite.email}:`, inviteErr);
        results.push({ email: invite.email, status: "failed" });
      }
    }

    const anyFailed = results.some((r) => r.status === "failed");

    res.status(anyFailed ? 207 : 200).json({
      message: anyFailed
        ? "Some team members could not be invited"
        : "Team members added successfully",
      results,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to invite members",
    });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const user = await User.findOne({
      firebaseUid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const pendingInvite = await TeamMember.findOne({
      inviteToken: req.body.inviteToken,
      status: "PENDING",
    });

    if (!pendingInvite) {
      return res.status(404).json({
        message: "Invite not found",
      });
    }

    pendingInvite.userId = user._id;

    pendingInvite.status = "ACCEPTED";

    await pendingInvite.save();

    res.json({
      message: "Invite accepted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to accept invite",
    });
  }
};
