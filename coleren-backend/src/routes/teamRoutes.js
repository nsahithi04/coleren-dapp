import express from "express";
import {
  deleteMember,
  updateMember,
  getTeam,
  inviteMember,
} from "../controllers/teamController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getTeam);
router.put("/:id", verifyToken, updateMember);
router.delete("/:id", verifyToken, deleteMember);
router.post("/invite", verifyToken, inviteMember);

export default router;
