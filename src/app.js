const express=require("express");
const connectDB=require("./config/database");
const app=express();
const User = require("./models/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

app.use(express.json()); 
app.use(cookieParser());

app.post("/signup",async(req,res)=>{
    try{
        validateSignupData(req);
        const {password, firstName, lastName,email}=req.body;

        const passwordHash = await bcrypt.hash(password,10);
    
        const user = new User({
            firstName, 
            lastName,
            email,
            password:passwordHash});
       await user.save()
       res.send("User created successfully");
    }catch(err){
        res.status(400).send("ERROR"+err.message);
    } 
});

app.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
        if (!email || !password){
            throw new Error("Email and password are required");
        }
        const user =await User.findOne({email:email});
        if(!user){
            throw new Error("User does not exist");
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            const token = jwt.sign({id:user._id},"DEVConnect@02");
           
            
            res.cookie("token",token);
            res.send("Login successfully");
        }else{
            throw new Error("Invalid credentials");
        }

    }catch(err){
        res.status(400).send("ERROR"+err.message);
    }
});
app.get("/profile", userAuth, async(req,res)=>{
  try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(401).send("ERROR"+err.message);
    }
});
app.get("/user",userAuth,async(req,res)=>{
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
app.patch("/user/:userID",async(req,res)=>{
    const data = req.body;
    const userId = req.params?.userID;
    try{
        const ALLOWED_UPDATES = ["photoUrl","about","skills","age","gender","password"];
        const isupdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
    );
    if(!isupdateAllowed){
        throw new Error("Invalid update");
        }
    if (data?.skills.length>10){
        throw new Error("Skills should be less than 10");
    }
    const user = await User.findByIdAndUpdate(userId,req.body,{
            returnDocument: "after",runValidators: true});
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


