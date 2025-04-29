const express=require("express");
const connectDB=require("./config/database");
const app=express();
const User = require("./models/user");

app.use(express.json()); //
app.post("/signup",async(req,res)=>{
    const user = new User(req.body);
    try{
       await user.save()
       res.send("User created successfully");
    }catch(err){
        res.status(400).send("Bad Reques"+err.message);
    } 
});
app.get("/user",async(req,res)=>{
    const usrerEmail = req.body.email;
    try{
        const user = await User.findOne({email:usrerEmail});
        if(!user){
            return res.status(404).send("User not found");
        }
        res.send(user);
    }catch(err){
        res.status(404).send("User Not found"+err.message);
    }
});    
app.get("/feed",async(req,res)=>{
    
    try{
        const users = await User.find();
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }
    
});

app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }    
});
app.patch("/user",async(req,res)=>{
    const data = req.body;
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndUpdate(userId,req.body);
        res.send("User updated successfully");
    }catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }
});

connectDB().then(()=>{
    console.log("Successfully connected to the database");
    app.listen(3000,()=>{
        console.log("Successfully started the server on port 3000....")
    });
}).catch((err)=>{
    console.error("Error connecting to the database",);
});


