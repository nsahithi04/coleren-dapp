import express from "express";
import { salesforceAuth } from "../controllers/connectorController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/salesforce", verifyToken, salesforceAuth);

export default router;
