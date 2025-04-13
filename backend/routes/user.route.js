import express from "express";
import {
  requestSignupUser,
  loginUser,
  signupUser,
  getUser,
  getApprovedUser,
  deleteApprovedUser,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/request-signup", requestSignupUser);
router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/get-user", requireAuth, getUser);
router.get("/get-approved-user", getApprovedUser);
router.delete("/delete-approved-user", deleteApprovedUser);

export default router;
