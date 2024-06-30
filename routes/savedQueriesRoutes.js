const mongoose = require('mongoose');
const SavedQueries = require('../models/SavedQueries');
const auth = require('../middleware/auth');
module.exports = (app) => {
  app.post('/api/:userId/movieQueries/add', auth, async (req, res) => {
    const { userId } = req.params;
    const { query } = req.body;

    //add mongod id to query
    query._id = mongoose.Types.ObjectId();
    //if user has no savedQuery create the document, if he has append to the array
    const savedQuery = await SavedQueries.findOne({ userId });
    if (!savedQuery) {
      const newSavedQuery = new SavedQueries({
        userId,
        queries: [query],
      });
      await newSavedQuery.save();
      res.send(newSavedQuery);
    } else {
      savedQuery.queries.push(query);
      await savedQuery.save();
      res.send(savedQuery);
    }
  });

  app.get('/api/:userId/movieQueries', auth, async (req, res) => {
    const { userId } = req.params;

    try {
      const savedQueries = await SavedQueries.findOne({ userId });

      if (!savedQueries) {
        return res.send({ queries: [] });
      }
      res.status(200).json(savedQueries);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
  app.delete('/api/:userId/movieQueries/:queryId', auth, async (req, res) => {
    //remove a query from the array
    const { userId, queryId } = req.params;

    try {
      const savedQueries = await SavedQueries.findOne({ userId });

      const query = savedQueries.queries.find((query) => query.id === queryId);

      const index = savedQueries.queries.indexOf(query);
      savedQueries.queries.splice(index, 1);
      await savedQueries.save();
      res.status(200).json(savedQueries);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
};
