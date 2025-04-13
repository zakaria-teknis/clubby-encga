import express from "express";
import {
  getClubs,
  getClubPageInfo,
} from "../../controllers/public/clubs.controller.js";

const router = express.Router();

router.get("/get-clubs", getClubs);
router.get("/get-club/:clubName", getClubPageInfo);

export default router;
