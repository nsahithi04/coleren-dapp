import express from "express";
import { getFeedback } from "../controllers/feedbackController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedback);

export default router;
