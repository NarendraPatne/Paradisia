const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
const validateReview=(req,res,next)=>{
    console.log(reviewSchema);
    let {error}=reviewSchema.validate(req.body)
    if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
}
// Route to create a new review on a post
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
// Delete Review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;