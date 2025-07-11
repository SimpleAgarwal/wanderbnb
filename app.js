const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
    console.log("connected to DB");
    })
    .catch((err)=>{
    console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//API CREATION
app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});


//INDEX ROUTE
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }));

    
    //New ROute
    app.get("/listings/new",wrapAsync(async (req,res)=>{
        res.render("listings/new.ejs");
    }));

    //show route
    app.get("/listings/:id",wrapAsync(async (req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        res.render("listings/show.ejs",{listing});
    }));

    //create route
    app.post("/listings",wrapAsync(async (req,res,next) => {
            const newListing= new Listing(req.body.listing);
            await newListing.save();
            res.redirect("/listings"); 
        })
        
    );

    //EDIT ROUTE
    app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
}));

    //UPDATE ROUTE

    app.put("/listings/:id",wrapAsync(async (req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect(`/listings/${id}`);
    }));

    //DELETE ROUTE

    app.delete("/listings/:id",wrapAsync(async (req,res)=>{
        let {id}=req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    }));








// app.get("/testListing",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample was Saved");
//     res.send("successful testing");

// });

app.all("*", (req,res,next) => {
    next(new ExpressError(404,"Page Not found!"));
});


app.use((err,req,res,next)=>{
    let{statusCode=500, message="something went wrong!"} = err;
    res.status(statusCode).send(message);
});


app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
