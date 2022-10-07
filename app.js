const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');
const auth = require('./auth');

// connect to database
dbConnect();

// CORS errors header response
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
response.json({ message: "Hey! This is your server response!" });
next();
});

// register endpoint
app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // on add user success
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // on add user reject 
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // on hash reject
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // on email success
    .then((user) => {
      // compare the password entered and the hashed password
      bcrypt
        .compare(request.body.password, user.password)

        // on pw success, proceed to token generation
        .then((passwordCheck) => {
          // on pw reject
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Incorrect password",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   on email success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // on pw reject response
        .catch((error) => {
          response.status(400).send({
            message: "Incorrect password",
            error,
          });
        });
    })
    // on email reject response
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// unprotected endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// protected endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;