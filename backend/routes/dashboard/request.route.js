import express from "express";
import {
  getRequests,
  approveRequest,
  rejectRequest,
} from "../../controllers/dashboard/request.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.put("/approve-request", approveRequest);
router.delete("/reject-request", rejectRequest);
router.get("/get-requests", getRequests);

export default router;
