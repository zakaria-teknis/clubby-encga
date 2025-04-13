import express from "express";
import {
  verifyPassword,
  updatePassword,
} from "../../controllers/dashboard/settings.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/verify-password", verifyPassword);
router.post("/update-password", updatePassword);

export default router;
