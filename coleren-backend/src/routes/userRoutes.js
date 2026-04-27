import express from "express";
import {
  getUser,
  createUser,
  checkEmailExists,
  getProfile,
  updateOnboarding,
  updateProfile,
} from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/login", verifyToken, getUser);
router.post("/signup", verifyToken, createUser);
router.post("/verifyEmail", checkEmailExists);
router.get("/profile", verifyToken, getProfile);
router.patch("/onboarding", verifyToken, updateOnboarding);
router.patch("/profile", verifyToken, updateProfile);

export default router;
