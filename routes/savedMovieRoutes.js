const mongoose = require('mongoose');

const SavedMovies = require('../models/SavedMovies');
const User = require('../models/User');
const auth = require('../middleware/auth');

module.exports = (app) => {
  app.post('/api/movies/add', auth, async (req, res) => {
    const userId = req.userId;

    const { movie } = req.body;
    try {
      let doc;
      doc = await SavedMovies.findOne({ userId });
      if (!doc) {
        const doc = new SavedMovies({ movies: movie, userId });
        await doc.save();
        return res.send(doc);
      }
      const isInDoc = doc.movies.find((mov) => mov.id === movie.id);
      if (isInDoc) {
        return res.status(400).send('movie already saved');
      }
      doc = await SavedMovies.findOneAndUpdate(
        userId,
        { $push: { movies: movie } },
        { new: true }
      );
      return res.send(doc);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.get('/api/movies', auth, async (req, res) => {
    const userId = req.userId;

    try {
      let doc;
      doc = await SavedMovies.findOne({ userId });
      if (!doc) {
        return res.send({ movies: [] });
      }

      return res.status(200).send(doc);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.delete('/api/movies/:movieId', auth, async (req, res) => {
    const userId = req.userId;

    const movieId = Number(req.params.movieId);
    try {
      let doc;
      doc = await SavedMovies.findOne({ userId });

      if (!doc) {
        return res.send({ error: 'cannot find doc' });
      }

      const movie = doc.movies.find((mov) => {
        return mov.id === movieId;
      });

      if (!movie) {
        return res.status(400).send('movie not found');
      }
      //remove movie from database
      doc = await SavedMovies.findOneAndUpdate(
        userId,
        { $pull: { movies: { id: movieId } } },
        { new: true }
      );

      return res.send(doc);
    } catch (e) {
      res.status(400).send(e);
    }
  });
};
