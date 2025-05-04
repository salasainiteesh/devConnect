const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLegth: 3,
        maxLength: 50,
        index: true,

    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid"+ value);
            }
        }   
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password"+ value);
            }
        }   
    },
    age:{
        type: Number,
        min:18,    
    },
    gender:{
        type: String,
        enum:{
            values:["male","female","other"],
            message: "{VALUE} is not supported"
        }
    },
    photoUrl:{
        type: String,
        default: "https://www.geographyandyou.com/images/user-profile.png",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Photo URL is invalid"+ value);
            }
        }   

    },
    about:{
        type: String,
        default: "default value about the user",
        minLegth:10,
        maxLength: 500,
    },
    skills:{
        type: [String]
   
    },
},{timestamps: true});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({id:user._id},"DEVConnect@02",{
        expiresIn: "8h",
    });
    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    if(!isPasswordValid){
        throw new Error("Invalid credentials");
    }
}
const User = mongoose.model('User', userSchema);
module.exports = User;
