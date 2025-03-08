// Requiring the required npm packages and models or paths.
if(process.NODE_ENV!="production"){
    require('dotenv').config()
}
// 
//console.log(process.env.Sec1ret)
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
// Requiuring Routers
const reviewsRouter=require("./routes/review.js");
const listingsRouter=require("./routes/listings.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const User=require("./models/user.js");
const { rmSync } = require("fs");
const dburl=process.env.ATLASDB_URL;
// ---------------------------------------------------------------
// Setting the view engine to ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// Middlewares
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
// Session middleware to establish a session using cookies
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});
store.on("error",(err)=>{
    console.log("Error in Mongo Session Store.",err);
})
app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// connect flash for flash messages
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // res.locals.success=req.flash("success");
    // console.log(res.locals.success);
    next();
});
// ---------------------------------------------------------------
app.get("/demouser",async(req,res)=>{
    let fakeuser={
        email:"abc@gmail.com",
        username:"fake-username"
    };
   let reguser=await User.register(fakeuser,"helloworld");
   res.send(reguser);
})
// Using routers
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.get("/",(req,res)=>{
    res.redirect("/listings")
});
// app.all("*",(req, res, next) => {
//     if (!res.headersSent) {
//         next(new ExpressError(404, "Page not found"));
//     }
// });
// ---------------------------------------------------------------

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log(e);
});
async function main()
{
    await mongoose.connect(dburl);
}
// --------------------------------------------------------------

// -----------------------------------------------------------------
// Error Handling Middlewares
app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong"}=err;
    // res.status(status).send(message);
    console.log(err)
    res.render("Errors.ejs",{message});
})
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// })
// Starting the server
app.listen(8080,()=>{
    console.log("Server Started!");
})
