import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  getMembers,
  addMember,
  deleteMember,
  updateMember,
} from "../../controllers/dashboard/members.controller.js";
import { multerProcessSingleImage } from "../../middleware/multer.js";

const router = express.Router();

router.use(requireAuth);

router.get("/get-members", getMembers);
router.post(
  "/add-member",
  multerProcessSingleImage,
  addMember
);
router.delete("/delete-member", deleteMember);
router.put("/update-member", multerProcessSingleImage, updateMember);

export default router;
