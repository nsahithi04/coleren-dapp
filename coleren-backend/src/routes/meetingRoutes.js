import express from "express";
import { getLatest } from "../controllers/meetingController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getLatest);

export default router;
