import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createUser, getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", authMiddleware, createUser); // PROTECTED
router.get("/user", authMiddleware, getCurrentUser);

export default router;
