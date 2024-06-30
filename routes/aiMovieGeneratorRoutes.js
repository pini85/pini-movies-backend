const User = require('../models/User');
const aiMovieCategories = require('../models/aiMovieCategory');
const generateMovieCategory = require('../services/AI/generateMovieCategory');
const generateMoviesByCategory = require('../services/AI/generateMoviesByCategory');
const generateMovieCategoryByInput = require('../services/AI/createMovieCategoryByInput');
const auth = require('../middleware/auth');
const credit = require('../middleware/credits');

module.exports = (app) => {
  app.post('/api/ai/generateCategory', auth, credit, async (req, res) => {
    const user = req.user;
    // const userId = req.body.user._id;
    try {
      const category = await generateMovieCategory();

      const movieObj = {
        title: category.mainMovie.title,
        vote_average: category.mainMovie.vote_average,
        poster_path: category.mainMovie.poster_path,
        release_date: category.mainMovie.release_date,
        id: category.mainMovie.id,
      };

      const aiMovieCategory = new aiMovieCategories({
        categoryName: category.categoryName,
        keywords: category.keywords,
        mainMovie: movieObj,
        createdByUser: 'AI',
      });
      //put it in the front of the array

      await aiMovieCategory.save();
      //decrease credit and get credit data
      const updateCredit = await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { credit: -1 } },
        { new: true }
      );
      //

      res.send({ category, credit: updateCredit.credit });
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.get('/api/ai/movieCategories', async (req, res) => {
    try {
      const categories = await aiMovieCategories.find({});
      const reverseList = categories.reverse();
      res.send(reverseList);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.get('/api/ai/moviesByCategory/:categoryName', async (req, res) => {
    const { categoryName } = req.params;

    try {
      const movies = await aiMovieCategories.find({ categoryName });

      const data = movies[0];
      res.send(data);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.post('/api/ai/generateMoviesByCategory', async (req, res) => {
    const { categoryName, numberOfMovies } = req.body;

    try {
      const movies = await generateMoviesByCategory(categoryName, numberOfMovies);

      await aiMovieCategories.findOneAndUpdate({ categoryName }, { $push: { movies } });
      res.send(movies);
    } catch (e) {
      res.status(400).send({ error: 'Could not generate movies by category' });
    }
  });
  app.post('/api/ai/generateMovieCategoryByInput', auth, credit, async (req, res) => {
    const { input } = req.body;

    const user = req.user;

    try {
      const category = await generateMovieCategoryByInput(input);
      const movieObj = {
        title: category.mainMovie.title,
        vote_average: category.mainMovie.vote_average,
        poster_path: category.mainMovie.poster_path,
        release_date: category.mainMovie.release_date,
        id: category.mainMovie.id,
      };

      const aiMovieCategory = new aiMovieCategories({
        categoryName: category.categoryName,
        keywords: category.keywords,
        mainMovie: movieObj,
        createdByUser: user.firstName,
      });
      await aiMovieCategory.save();
      const updateCredit = await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { credit: -1 } },
        { new: true }
      );

      res.send({ category, credit: updateCredit.credit });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  });
};
