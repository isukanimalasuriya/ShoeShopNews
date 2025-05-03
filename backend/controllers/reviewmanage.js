import Review from "../modeles/review.js";
import mongoose from "mongoose";


export async function addReview(req, res) {
    try {
        const { brandId, userId, userFullName, rating, comment,profilepicture} = req.body;
        const shoePicture = `/images/${req.file.filename}`;

        // Create a new review since no duplicate exists
        const newReview = new Review({
            brandId,
            userId,
            userFullName,
            rating,
            comment,
            shoePicture,
            profilepicture
        });

        console.log(newReview);
        
        await newReview.save();
        res.status(200).json({ message: "Review added successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export async function getReview(req, res) {

    try{
        const reviews = await Review.find({});
        res.json(reviews);
        return;

    }catch(e){
    res.status(500).json({
        message:"Failed to get reviews"
    })
    }
}


export async function updateReview(req, res) {
    try {
      const { reviewId } = req.params;
      const data = req.body;
  
      console.log("Incoming data:", data);
      console.log("Uploaded file:", req.file);
  
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      // Check permission
      if (review.userId !== data.userId) {
        return res.status(403).json({ message: "Unauthorized to update this review" });
      }
  
      // Update image path if a new file was uploaded
      if (req.file) {
        data.shoePicture = `/images/${req.file.filename}`;
      }
  
      // Update the review
      await Review.updateOne({ _id: reviewId }, data);
  
      res.json({ message: "Review updated successfully" });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Failed to update Review" });
    }
}

export async function deleteReview(req,res) {
    try{
        const {reviewId} = req.params;

        const reviewObjId = new mongoose.Types.ObjectId(reviewId);

        await Review.deleteOne({_id:reviewObjId})

    res.json({message:"Review deleted successfully"})
    }catch(e){
        res.status(500).json({
            message:"Failed to delete review"
        })
    }
}