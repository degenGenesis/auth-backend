const mongoose = require('mongooose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'Email already exists'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    unique: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model('Users', UserSchema);