const openai = require('./config');
const json5 = require('json5');
const aiMovieCategories = require('../../models/aiMovieCategory');
const { getMovieByTitle } = require('../../API/tmdb');

//give me a good text that their role is a movie enthusiest and i will give a category and it will give me very great unique movie suggesitons in json format

const generatePrompt = (exisitingMovie, category, numberOfMovies) => {
  const user = { role: 'user', text: category };
  const conversation = [system, user];
  return conversation;
};

const generateMoviesByCategory = async (category, numberOfMovies) => {
  if (numberOfMovies > 15) {
    throw new Error('Number of movies must be less than 15');
  }
  const categoryData = await aiMovieCategories.findOne({
    categoryName: category,
  });
  const exisitingMovie = categoryData?.mainMovie?.title ?? '';
  const system = {
    role: 'system',
    content: `You are a professional movie recommendation generator. 
  - I will give you a movie category and you will give me ${numberOfMovies}. 
  - I want movies that is highly rated and unique. 
  - Do not include this movie ${exisitingMovie}.
  - I want the movies in JSON format. with the key "category" a key "movies" that is an array which has movie objects with a key "title" and "rating".
  - Example: {"category": 'action', "movies":[{"title":"title 1","rating":"7.5"},{"title":"title 2","rating":"8.1"}]}
  - Make your response as short as possible.`,
  };

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [system],
      temperature: 0.5,
      max_tokens: 700,
    });
    text = completion.data.choices[0].message;
    const data = json5.parse(text.content);

    // data = json5.parse(text);
    const movies = await Promise.all(
      data.movies.map(async (movie) => {
        const movieData = await getMovieByTitle(movie.title);
        movie.title = movieData.results[0].title;
        movie.vote_average = movie.rating;
        movie.poster_path = movieData.results[0].poster_path;
        movie.release_date = movieData.results[0].release_date;
        movie.id = movieData.results[0].id;
        return movie;
      })
    );
    return movies;
  } catch (e) {
    console.log(e);
  }
};

module.exports = generateMoviesByCategory;
