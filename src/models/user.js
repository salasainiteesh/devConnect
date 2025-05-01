const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLegth: 3,
        maxLength: 50,

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
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is invalid");
            }
        },
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
const User = mongoose.model('User', userSchema);
module.exports = User;
