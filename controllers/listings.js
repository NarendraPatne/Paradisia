const Listing=require("../models/listing.js");
module.exports.index=async (req,res)=>{
    const allListings= await Listing.find();
    res.render("listings/index.ejs",{allListings});
}
module.exports.renderNewListingForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;

    let listing=req.body.listing;
    if(!listing.image)
    {
        listing.image="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    }
    const newlisting=new Listing(listing);
    newlisting.owner=req.user._id;
    newlisting.image={filename,url}
    await newlisting.save();
    req.flash("success","New Listing Created.")
    res.redirect("/listings");
}
module.exports.renderEdit=async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    if(!list)
    {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    // let originalurl=list.image.url;
    // originalurl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{list});
}
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined")
    {
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={filename,url};
        await listing.save();
    }
    console.log("Updated");
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Listing Deleted");
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}
module.exports.showListing=async (req,res)=>{
    let id=req.params.id;
    const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

    if(!listing)
    {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}