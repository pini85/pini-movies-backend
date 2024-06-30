const mongoose = require('mongoose');
const { Schema } = mongoose;

const savedQueriesSchema = new Schema({
  queries: [],
  userId: Schema.Types.ObjectId,
});

module.exports = mongoose.model('savedQueries', savedQueriesSchema);
