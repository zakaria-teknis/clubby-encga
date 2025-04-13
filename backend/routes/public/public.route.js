import express from "express";
import clubRoutes from "./club.route.js";
import eventRoutes from "./event.route.js";

const router = express.Router();

router.use("/clubs", clubRoutes);
router.use("/events", eventRoutes);

export default router;
