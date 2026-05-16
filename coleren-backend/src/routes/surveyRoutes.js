import express from "express";
import { sendSurvey } from "../controllers/surveyController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, sendSurvey);

export default router;
