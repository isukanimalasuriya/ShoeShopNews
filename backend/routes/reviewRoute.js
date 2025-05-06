import express from "express";
import multer from "multer";
import { addReview,deleteReview,getReview,updateReview } from "../controllers/reviewmanage.js";


const reviewRoute = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/shoeshop-frontend/public/images"); // adjust path as needed
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

reviewRoute.post("/",upload.single("reviewImage"),addReview);
reviewRoute.get("/",getReview)
reviewRoute.put("/:reviewId", upload.single("reviewImage"), updateReview);
reviewRoute.delete("/:reviewId",deleteReview )

export default reviewRoute