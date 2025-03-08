const mongoose=require("mongoose");
const Review=require("./review.js");
const { listingSchema } = require("../schema.js");
const Schema=mongoose.Schema;
const listSchema=new Schema({
    title:{
        type:String,
    required:true},
    description:String,
    // image:{
    //     type:String,
    //     default:"https://images.unsplash.com/photo-1556446384-0c6fd6c8e673?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     required:true
    // },
    image:{
        filename:String,
        url:{
            type:"String",
            default:"https://images.unsplash.com/photo-1556446384-0c6fd6c8e673?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            required:true
        }
        }
    ,
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review" 
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["mountains","arctic","farms","beach","trending","pools","camping","castle","iconic city","rooms"]
    }
});
listSchema.post("findOneAndDelete",async(listing)=>{
if(listing)
{
    await Review.deleteMany({_id:{$in:listing.reviews}})
}
});
const Listing=mongoose.model("Listing",listSchema);
module.exports=Listing;