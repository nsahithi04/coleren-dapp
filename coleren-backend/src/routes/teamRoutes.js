import express from "express";
import {
  deleteMember,
  updateMember,
  getTeam,
} from "../controllers/teamController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getTeam);
router.put("/:id", verifyToken, updateMember);
router.delete("/:id", verifyToken, deleteMember);

export default router;
