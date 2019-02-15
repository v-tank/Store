// import packages
const express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// set port and create server
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// require all routes to be used by server
var routes = require('./routes/routes');
app.use('/', routes);

// set up connection to mongoDB
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/products';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(response => console.log("Connected to the database."));

// start server and listen for requests on designated port
app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
