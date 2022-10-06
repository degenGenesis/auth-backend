// external imports
const mongoose = require('mongoose');
require('dotenv').config();

// connect to database DB_URL connection string
async function dbConnect() {
  mongoose
    .connect(
      process.env.DB_URL, 
      {
        // options ensuring proper connection
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
      console.log('Unable to connect to MongoDB Atlas!');
      console.error(error);
    });
}

module.exports = dbConnect;