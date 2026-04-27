// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

import admin from "../config/firebase.js";

// dotenv.config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  //   jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
  //     if (err) return res.sendStatus(403);
  //     req.user = user;
  //     next();
  //   });

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyToken;
