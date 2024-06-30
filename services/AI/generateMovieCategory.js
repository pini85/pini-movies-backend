const openai = require('./config');
const aiMovieCategory = require('../../models/aiMovieCategory');
const { getMovieByTitle } = require('../../API/tmdb');
const json5 = require('json5');

const generatePrompt = () => {
  return;
};

const generateMovieCategory = async () => {
  const categories = await aiMovieCategory.find({});
  const existingCategories = categories.map((category) => category.categoryName);
  const exisitingMovieNames = categories.map((category) => category.mainMovie.name);
  const system = {
    role: 'system',
    content: `
    You are a professional movie category generator.
    Suggest a random unique movie category like "best movies to watch in a rainy day" or "all time highest grossing movies" or "best movie oscars" and provide a popular movie in this category with a high IMDb rating.The category and movie must be unique. You should not provide the following categories:###${existingCategories}###. 
    Also give me 5 keywords the describe the category.
    Return a json with the following keys: "categoryName", "keywords" which is an array of string keywords, "mainMovie" which is an object with the keys "name" and "rating".
  - Example:
   {"categoryName": "Movies to watch with your wife","keywords":["5 keywords"],"mainMovie":{"name": "movie title", "rating": "8.5"}}
  `,
  };

  try {
    completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [system],
      temperature: 1,
      max_tokens: 200,
    });

    const text = completion.data.choices[0].message;
    const suggestion = json5.parse(text.content);

    const tmdbMovie = await getMovieByTitle(suggestion.mainMovie.name);

    suggestion.mainMovie.title = suggestion.mainMovie.name;
    suggestion.mainMovie.id = tmdbMovie.results[0].id;
    suggestion.mainMovie.poster_path = tmdbMovie.results[0].poster_path;
    suggestion.mainMovie.release_date = tmdbMovie.results[0].release_date;
    suggestion.mainMovie.vote_average = tmdbMovie.results[0].vote_average;

    return suggestion;
  } catch (e) {
    return e;
  }
};

module.exports = generateMovieCategory;
