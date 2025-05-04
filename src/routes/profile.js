const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const {validatePasswordChange} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
    try{
          const user = req.user;
          res.send(user);
      }catch(err){
          res.status(401).send("ERROR"+err.message);
      }
  });
profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try{
         if(!validateEditProfileData(req)){
             throw new Error("Invalid data");
         }
         const loggedInuser = req.user;
         Object.keys(req.body).forEach((key)=>{
             loggedInuser[key]=req.body[key]});
         loggedInuser.save();
            res.json({
             message:'${loggedInuse.firstName},your Profile is updated successfully',
             data:loggedInuser,
         });
         
      }catch(err){
          res.status(401).send("ERROR"+err.message);
      }
  });
  profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await validatePasswordChange(currentPassword, newPassword, req.user.password);
        const passwordHash = await bcrypt.hash(newPassword, 10);
        req.user.password = passwordHash;
        await req.user.save();
        res.clearCookie("token");
        res.send("Password updated successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});
  module.exports = profileRouter;