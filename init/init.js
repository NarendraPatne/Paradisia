const mongoose=require("mongoose")
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log(e);
})
async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async ()=>{
    await Listing.deleteMany();
    // const modifiedata=initdata.data.map((obj)=>({...obj,owner:"67b9cc19c007acc753816d52"}));
    const modifiedData = initdata.data.map((obj) => ({ 
        ...obj, 
        owner: new mongoose.Types.ObjectId("67b9cc19c007acc753816d52")  // Ensure it's a valid ObjectId
    }));
    await Listing.insertMany(modifiedData);
    console.log("Listing Collection was initialised.");
}
initDB();