const bcrypt = require('bcrypt');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');

// connect to database
dbConnect();

// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post('/register', (request, response) => {
  // hash password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create new user
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: 'User created successfully!',
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: 'Password was not hashed correctly',
            error,
          });
        });
    });
});

module.exports = app;