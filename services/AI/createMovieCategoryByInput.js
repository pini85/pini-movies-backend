const openai = require('./config');
const json5 = require('json5');
const { getMovieByTitle } = require('../../API/tmdb');

const createMovieCategoryByInput = async (input) => {
  const delimiter = '###';
  const system = {
    role: 'system',
    content: `
  You are a professional movie category generator.
  Generate a movie category based on a users.The input is delimited with ${delimiter} characters. 
  - If the input cannot be transformed to a valid movie category return a json: {"error":"not valid"}
  - Example for not valid inputs:"tttt" or "dfgdfgerygerg" or "456ergre534".
  - If it is a valid category then also provide a popular movie in this category with a high IMDb rating. The movie must be unique. 
  - Also give me 5 keywords the describe the category. Return a json with the following keys: "categoryName", "keywords" which is an array of string keywords, "mainMovie" which is an object with the keys "name" and "rating".
  - Example:
    user input: "best comedies of the past decade"
    output: {"categoryName": "best comedies of the past decade","keywords":["5 keywords"],"mainMovie":{"name": "movie title", "rating": "8.5"}}
    input: ${delimiter}${input}${delimiter}`,
  };

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [system],
      temperature: 0.7,
      max_tokens: 200,
    });

    const text = completion.data.choices[0].message;

    const suggestion = json5.parse(text.content);
    const movie = suggestion.mainMovie.name.trim();

    const tmdbMovie = await getMovieByTitle(suggestion.mainMovie.name);
    suggestion.mainMovie.title = movie;
    suggestion.mainMovie.id = tmdbMovie.results[0].id;
    suggestion.mainMovie.poster_path = tmdbMovie.results[0].poster_path;
    suggestion.mainMovie.release_date = tmdbMovie.results[0].release_date;
    suggestion.mainMovie.vote_average = tmdbMovie.results[0].vote_average;

    return suggestion;
  } catch (e) {
    throw e;
  }
};

module.exports = createMovieCategoryByInput;
