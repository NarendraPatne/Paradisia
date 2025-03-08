const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })
// Router.route helping in merging all the routes with same path
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.renderNewListingForm);
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, listingController.updateListing)
.delete(isLoggedIn,isOwner,listingController.destroyListing);
// Show all the listings index
// router.get("/",wrapAsync(listingController.index));
// Route to render form for creating new listing
// Route to create new listing and save it.
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));
// Update Listing form render get request
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEdit);
// Update listing in db
// router.put("/:id", isLoggedIn,isOwner, validateListing, listingController.updateListing);
// Delete listing
// router.delete("/:id",isLoggedIn,isOwner,listingController.destroyListing);
// Show particular listing using its id
// router.get("/:id",wrapAsync(listingController.showListing))
module.exports=router;
// router.put("/:id",isLoggedIn,validateListing,async (req,res)=>{
//     let {id}=req.params;
//     let listings=await Listing.findById(id);
//     if(!res.locals.currUser && !listings.owner._id.equals(res.locals.currUser._id))
//     {
//         req.flash("error","You don't have permission to Edit!");
//         res.redirect(`/listings/${id}`);
//     }
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     console.log("Updated");
//     req.flash("success","Listing Updated!");
//     res.redirect(`/listings/${id}`);
// });