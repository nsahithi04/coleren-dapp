import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createOrUpdateProfile,
  getMyProfile,
  updateOnboarding,
  getSettings,
  updateSettings,
} from "../controllers/profileController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrUpdateProfile);
router.get("/me", authMiddleware, getMyProfile);
router.patch("/onboarding", authMiddleware, updateOnboarding);
router.get("/settings", auth, getSettings);
router.patch("/settings", auth, updateSettings);

export default router;
