import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  updateProfileInfo,
  updateProfileImage,
} from "../../controllers/dashboard/profile.controller.js";
import { multerProcessSingleImage } from "../../middleware/multer.js";
import { deleteProfileImage } from "../../controllers/dashboard/profile.controller.js";

const router = express.Router();

router.use(requireAuth);

router.put("/update-profile-info", updateProfileInfo);
router.post(
  "/update-profile-image",
  multerProcessSingleImage,
  updateProfileImage
);
router.delete("/delete-profile-image", deleteProfileImage);

export default router;
