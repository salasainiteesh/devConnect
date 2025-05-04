const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { populate } = require('../models/user');
const USER_SAFE_DATA = ["firstName", "lastName", "age","profilePicture", "about" , "skills",   ];
const User = require('../models/user');

userRouter.get("/user/request/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        res.status(200).json({
            message: " Requests received",
            data: connectionRequests,
        });
    }catch (err) {
        console.error(error);
        res.status(400).send("ERROR" + err.message);
    }
});

userRouter.get("/user/request/connections", userAuth, async(req, res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
           $or:[ 
            {toUserId: loggedInUser._id ,status: "accepted"},
            {fromUserId: loggedInUser._id ,status: "accepted"},
        ],

        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                    return row.toUserId;
            }
            row.fromUserId;
        });
        res.status(200).json({
            message: " Connections found successfully",
            data: data,
        });
    }catch (err) {
        console.error(error);
        res.status(400).send("ERROR" + err.message);
    }
    
});
userRouter.get("/feed", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 100 ? 100 : limit;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id ,},
                {fromUserId: loggedInUser._id},
            ],
        }).select("fromUserId toUserId status")
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
                hideUserFromFeed.add(req.toUserId._id.toString());
                hideUserFromFeed.add(req.fromUserId._id.toString());
        });
        const users = await User.find({
          $and:[ 
            {_id : { $nin: Array.from(hideUserFromFeed) }},
            {_id: { $ne: loggedInUser._id}},]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        
        res.status(200).json({
            message: "Feed found successfully",
            data: users,
        });

        
    } catch (err) {
        res.status(400).json({message: err.message});
    }

});
module.exports = userRouter;