import express from "express";
import requestRoutes from "./request.route.js";
import profileRoutes from "./profile.route.js";
import boardRoutes from "./board.route.js";
import memberRoutes from "./member.route.js";
import clubRoutes from "./club.route.js";
import eventRoutes from "./event.route.js";
import settingRoutes from "./setting.route.js";

const router = express.Router();

router.use("/requests", requestRoutes);
router.use("/profile", profileRoutes);
router.use("/board", boardRoutes);
router.use("/members", memberRoutes);
router.use("/club", clubRoutes);
router.use("/events", eventRoutes);
router.use("/settings", settingRoutes);

export default router;
