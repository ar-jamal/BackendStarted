const express = require("express");
const app = express()
const PORT = process.env.PORT || 5000
const userModel = require("./Models/user")

const mongoose = require("mongoose");
const { query, response } = require("express");
const DBURI = "mongodb+srv://jamal:ar10151416@cluster0.kducuyp.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DBURI)
    .then((res) => console.log("MongoDb connected successfully"))
    .catch((err) => console.log("DB error hai", err))

// BODY PARSER
app.use(express.json())

// SIGNUP API

app.post("/api/signupUser", (request, response) => {

    const { userName, firstName, lastName, email, password, phoneNumber, dateOfBirth } = request.body

    const objToSend = {
        user_name: userName,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone_number: phoneNumber,
        dob: dateOfBirth
    }

    if (!userName, !firstName, !lastName, !email, !password, !phoneNumber, !dateOfBirth) {
        response.json({
            message: "plz filled all required fields",
            status: false
        }) 
        return;
    } 
    // else {
        userModel.find({ email: email } || {user_name: userName }, (error, data) => {
            if (error) {
                response.send(`internal error: ${error}`)
            } else if (data) {
                response.send("user already exists try other email")
            } else {
                userModel.create(objToSend, (error, data) => {
                    if (error) {
                        response.json({
                            message: `internal error: ${error}`,
                            status: false
                        })
                    } else {
                        response.json({
                            message: "user successfully created",
                            status: true
                        })
                        userModel.findOne({email: email} && {password: password}, (error, data) => {
                            if(error) {
                                response.json({
                                    message: "internal error"
                                })
                            } else {
                                
                            }
                        })
                    }
                })
            }
        })
    // }
})


// GET SINGLE USER 
// app.get("/api/user/:userid", (request, response) => {
app.get("/api/user", (request, response) => {
    // console.log(request.params)
    const userID = request.params.userid
    const { id } = request.query
    console.log(id)

    // userModel.findOne({_id: userID}, (error, data) => {
    // userModel.find({email: "ar.jamalkarim@gmail.com"}, (error, data) => {
    userModel.findById(id, (error, data) => {
        if (error) {
            // response.send(`internal error: ${error}`
            response.json({
                message: `internal error: ${error}}`,
                status: false
            })
        } else {
            response.json({
                message: "user successfully get",
                data: data,
                status: true
            })

        }
    })
    // response.send("Hello World new today")
})
// user create 
app.post("/api/user", (request, response) => {
    console.log(request.body)
    const { firstName, lastName, email, password, } = request.body;
    // const {firstName, lastName, email, password} = request.body || {};

    // const reqField = firstName &&
    //     lastName &&
    //     email &&
    //     password

    const objToSend = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
    }
    if (!firstName, !lastName, !email, !password) {
        response.send("plz filled all required fields")
    } else {
        userModel.create(objToSend, (error, data) => {
            if (error) {
                // response.send(`internal error: ${error}`
                response.json({
                    message: `internal error: ${error}}`,
                    status: false
                })
            } else {
                response.json({
                    message: "user created successfully",
                    data: data,
                    status: true
                })
            }
        })
    }
})

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))