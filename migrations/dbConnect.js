var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

mongoose.connect(process.env.MONGODB_URL);

module.exports = {
  mongoose: mongoose,
  mongodb: MongoClient.connect(process.env.MONGODB_URL) // mongo Driver return a Promise
};
