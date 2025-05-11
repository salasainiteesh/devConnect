const jwt=require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token){
            return res.status(401).send("Please login to access this resource");
        }
        const decoded = jwt.verify(token, "DEVConnect@02");
        const { id } = decoded;
        const user = await User.findById(id);
        if(!user){
            throw new Error("User does not exist");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("ERROR"+err.message);
    }
};

module.exports = {userAuth,};
