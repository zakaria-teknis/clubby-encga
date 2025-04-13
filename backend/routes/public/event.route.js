import express from "express";
import {
  getEvents,
  getEventPageInfo,
} from "../../controllers/public/events.controller.js";

const router = express.Router();

router.get("/get-events", getEvents);
router.get("/get-event/:clubName/:eventNameSlug", getEventPageInfo);

export default router;
