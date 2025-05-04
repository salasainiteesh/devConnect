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

const authrouter = require('./routes/auth');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');
const userRouter = require("./routes/user");

app.use("/",authrouter);
app.use("/",requestRouter);
app.use("/",profileRouter);
app.use("/",userRouter);

connectDB().then(()=>{
    console.log("Successfully connected to the database");
    app.listen(3000,()=>{
        console.log("Successfully started the server on port 3000....")
    });
}).catch((err)=>{
    console.error("Error connecting to the database",);
});


