const mongoose = require('mongoose');
const { Schema } = mongoose;

const aiMovieCategorySchema = new Schema({
  categoryName: { type: String, required: true },
  keywords: { type: Array, required: true },
  mainMovie: {
    title: { type: String, required: true },
    vote_average: { type: Number, required: true },
    poster_path: { type: String, required: true },
    release_date: { type: String, required: true },
  },
  movies: [Object],
  createdByUser: { type: String, required: true },
});

module.exports = mongoose.model('aiMovieCategories', aiMovieCategorySchema);
