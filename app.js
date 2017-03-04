/**
 * Bootstrap application file
 *
 * This is the main entry point of the application, it will load configurations, initialize the app and start the
 * Express server
 */
// Load babel for subsequent imports in ES2015
require('babel-register');

// Load .env file
require('dotenv').load({
  path: __dirname + '/.env'
});

var path = require('path');
var http = require('http');
var mongoose = require('mongoose');

// Path for application config directory to be loaded by config module
process.env.NODE_CONFIG_DIR = path.join(__dirname, '/config/environment');

//Fix for PM2
var app_instance = process.env.NODE_APP_INSTANCE;
process.env.NODE_APP_INSTANCE = "";
require('config');
process.env.NODE_APP_INSTANCE = app_instance;
var config = require('./config/environment');

// Configure and connect Mongoose
//set mongoose Promise provider to bluebird
mongoose.Promise = require('bluebird');
// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Require Express App
var app = require('./config/express');

// Create Http Server
var server = http.createServer(app);

// Start Express server
server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  var host = config.ip ? config.ip : 'localhost';
  console.log('Access URL:');
  console.log('------------------------------------------');
  console.log('WWW - > %s', "http://" + host + ":" + config.port);
  console.log('------------------------------------------');
});
