import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  getBoardMembers,
} from "../../controllers/dashboard/board.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/get-board-members", getBoardMembers);

export default router;
