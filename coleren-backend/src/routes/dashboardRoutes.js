import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, getDashboard);

export default router;
