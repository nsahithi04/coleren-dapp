import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";

import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import connectorRoutes from "./routes/connectorRoutes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://coleren-dapp.web.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/connectors", connectorRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
