const mongoose = require('mongoose');

const { Schema } = mongoose;

const user = new Schema({
  firstName: String,
  lastName: String,
  picture: String,
  email: String,
  credit: Number,
});

module.exports = mongoose.model('users', user);
