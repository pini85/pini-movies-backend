const mongoose = require('mongoose');
const { Schema } = mongoose;

const savedMoviesSchema = new Schema({
  movies: [],
  userId: Schema.Types.ObjectId,
});

module.exports = mongoose.model('savedMovies', savedMoviesSchema);
