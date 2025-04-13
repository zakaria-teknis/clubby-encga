import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const tempImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, process.env.TMP_PATH);
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  },
});

export const multerProcessSingleImage = multer({
  storage: tempImageStorage,
}).single("file");

export const multerProcessEventImages = multer({
  storage: tempImageStorage,
}).fields([
  { name: "coverImage", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "guestImages" },
]);
