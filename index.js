require("dotenv-flow").config({
  path: "./config",
});
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("NODE ENV:", process.env.NODE_ENV);

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
app.use(bodyParser.json());
require("./models/User");
require("./models/SavedMovies");

mongoose.connect(process.env.MONGO_URI);
console.log("test");
app.use(express.static(__dirname, { dotfiles: "allow" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  return next();
});

app.options("*", cors());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});
require("./routes/authRoutes")(app);
require("./routes/savedMovieRoutes")(app);
require("./routes/savedQueriesRoutes")(app);
require("./routes/watchMovieRoutes")(app);
require("./routes/aiMovieGeneratorRoutes")(app);

if (process.env.NODE_ENV === "production") {
  //if the handlers above won't resolve the request it will go to the next route handler below

  //Express will serve up production assests. Like our main.js or main.css
  app.use(express.static("client/build"));
  //if this handler cannot resolve it then go to the next one.
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
