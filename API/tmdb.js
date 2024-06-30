const axios = require("axios");

const getTmdbWithId = async (id) => {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );

  return data;
};
const getMovieByTitle = async (title) => {
  console.log("title", title);
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${title}`
  );
  return data;
};
module.exports = {
  getTmdbWithId,
  getMovieByTitle,
};
