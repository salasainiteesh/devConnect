const validator = require('validator');
const bcrypt = require('bcrypt');
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

const validateEditProfileData = (req) => {
    const allowedEditFields=["firstName","lastName","email","age","photoUrl","gender","about","skills"];

    const isEditAllowedField=Object.keys(req.body).every((key)=>
        allowedEditFields.includes(key)
    );
    return isEditAllowedField;
}
const validatePasswordChange = async (currentPassword, newPassword, userPasswordHash) => {
    if (!currentPassword || !newPassword) {
        throw new Error("Both current and new passwords are required");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, userPasswordHash);
    if (!isPasswordValid) {
        throw new Error("Existing password is incorrect");
    }

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error(
            "New password is weak. It must include at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol."
        );
    }

    return true;
};

module.exports = {
    validateSignupData,
    validateEditProfileData,
    validatePasswordChange,
};