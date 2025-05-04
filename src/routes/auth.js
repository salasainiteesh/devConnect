const express = require('express');
const authrouter = require('express').Router();
const User = require("../models/user");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");

authrouter.post("/signup",async(req,res)=>{
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

authrouter.post("/login",async(req,res)=>{
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
            const token = await user.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now()+ 8 * 3600000),});
            res.send("Login successfully");
        }else{
            throw new Error("Invalid credentials");
        }

    }catch(err){
        res.status(400).send("ERROR"+err.message);
    }
});
authrouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
    res.send("Logout successfully");
});

module.exports = authrouter;