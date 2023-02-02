const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    user_name: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    phone_number: String,
    dob: String
})

const userModel = mongoose.model("signupUser", userSchema)
module.exports = userModel;