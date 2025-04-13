import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  addEvent,
  editEvent,
  getEvents,
  deleteEvent,
} from "../../controllers/dashboard/events.controller.js";
import { multerProcessEventImages } from "../../middleware/multer.js";

const router = express.Router();

router.use(requireAuth);

router.get("/get-events", getEvents);
router.post("/add-event", multerProcessEventImages, addEvent);
router.put("/edit-event", multerProcessEventImages, editEvent);
router.delete("/delete-event", deleteEvent);

export default router;
