const mongoose = require("mongoose");
const connection = process.env.MONGO_URI;
mongoose.connect(connection, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
