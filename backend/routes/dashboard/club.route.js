import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  updateClubInfo,
  updateClubLogo,
  deleteClubLogo,
} from "../../controllers/dashboard/club.controller.js";
import { multerProcessSingleImage } from "../../middleware/multer.js";

const router = express.Router();

router.use(requireAuth);

router.put("/update-club-info", updateClubInfo);
router.post("/update-club-logo", multerProcessSingleImage, updateClubLogo);
router.delete("/delete-club-logo", multerProcessSingleImage, deleteClubLogo);

export default router;
