const validator = require('validator');
const validateSignupData = (req) => {
    const { email, password, firstName, lastName } = req.body;
    if(!firstName||!lastName){
        throw new Error("Name is required");
    }else if (!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is weak");
    }
};

module.exports = {
    validateSignupData,
};