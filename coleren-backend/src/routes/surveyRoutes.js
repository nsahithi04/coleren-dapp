import express from "express";
import {
  sendSurvey,
  createSurvey,
  getSurveyById,
  submitSurvey,
} from "../controllers/surveyController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, sendSurvey);
router.post("/create", verifyToken, createSurvey);
router.get("/:surveyId", getSurveyById);
router.post("/submit/:surveyId", submitSurvey);

export default router;
