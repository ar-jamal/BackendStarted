const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const userModel = require("./Models/user");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { query } = require("express");
const DBURI =
  "mongodb+srv://jamal:ar10151416@cluster0.kducuyp.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DBURI)
  .then((res) => console.log("MongoDb connected successfully"))
  .catch((err) => console.log("DB error hai", err));

// BODY PARSER
app.use(express.json());

// SIGNIN
app.post("/api/signinuser", async (req, res) => {
  const { userName, email, password } = req.body;
  // const hashPassword = bcrypt.hashSync(password, 10)

  const objToSend = {
    user_name: userName,
    email: email,
    password: password,
  };

  if (!email || !password) {
    res.json({
      message: "plz filled all required fields",
      status: false,
    });
    return;
  }
  try {

    const user = await userModel.findOne({ email: email });
    console.log(user)
    if (!user) {
      res.json({
        message: "credentials error",
        status: false,
      });
      return;
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
      if (comparePassword) {
        res.json({
          message: `user successfully login`,
          status: true,
          user,
        });
      } else {
        res.json({
          message: "credentials error",
          status: false,
        });
      }
  } catch (err) {
    res.json({
      message: `internal error: ${err.message}`,
      status: false,
    });
  }

});

// SIGNUP API
app.post("/api/signupUser", async (req, res) => {
  const {
    userName,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    dateOfBirth,
  } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);

  const objToSend = {
    user_name: userName,
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: hashPassword,
    phone_number: phoneNumber,
    dob: dateOfBirth,
  };

  if (
    !userName ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !dateOfBirth
  ) {
    res.json({
      message: "plz filled all required fields",
      status: false,
    });
    return;
  }
  try {
    const data = await userModel.findOne({ email: email });
    if (data) {
      console.log(data);
      return res.json({
        status: false,
        message: "user already exists try other email",
      });
    }
    const user = await userModel.create(objToSend);
    res.json({
      message: "user successfully created",
      data: user,
      status: true,
    });
  } catch (err) {
    res.json({ message: `internal error: ${err.message}`, status: false });
  }
});

// GET SINGLE USER
// app.get("/api/user/:userid", (req, res) => {
app.get("/api/user", (req, res) => {
  // console.log(req.params)
  const userID = req.params.userid;
  const { id } = req.query;
  console.log(id);

  // userModel.findOne({_id: userID}, (error, data) => {
  // userModel.find({email: "ar.jamalkarim@gmail.com"}, (error, data) => {
  userModel.findById(id, (error, data) => {
    if (error) {
      // res.send(`internal error: ${error}`
      res.json({
        message: `internal error: ${error}}`,
        status: false,
      });
    } else {
      res.json({
        message: "user successfully get",
        data: data,
        status: true,
      });
    }
  });
  // res.send("Hello World new today")
});
// user create
app.post("/api/user", (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, password } = req.body;
  // const {firstName, lastName, email, password} = req.body || {};

  // const reqField = firstName &&
  //     lastName &&
  //     email &&
  //     password

  const objToSend = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  };
  if ((!firstName, !lastName, !email, !password)) {
    res.send("plz filled all required fields");
  } else {
    userModel.create(objToSend, (error, data) => {
      if (error) {
        // res.send(`internal error: ${error}`
        res.json({
          message: `internal error: ${error}}`,
          status: false,
        });
      } else {
        res.json({
          message: "user created successfully",
          data: data,
          status: true,
        });
      }
    });
  }
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
