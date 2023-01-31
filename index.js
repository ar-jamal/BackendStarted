const express = require("express");
const app = express()
const PORT = process.env.PORT || 5000
const userModel = require("./Models/user")

const mongoose = require("mongoose")
const DBURI = "mongodb+srv://jamal:ar10151416@cluster0.kducuyp.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DBURI)
    .then((res) => console.log("MongoDb connected successfully"))
    .catch((err) => console.log("DB error hai", err))

// BODY PARSER
app.use(express.json())

// GET SINGLE USER 
app.get("/api/user/:userID", (request, response) => {
    console.log(request.params)

    mongoose.find
    response.send("Hello World new today")
})
// user create 
app.post("/api/user", (request, response) => {
    console.log(request.body)
    const {firstName, lastName, email, password} = request.body;
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