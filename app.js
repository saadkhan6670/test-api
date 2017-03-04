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
var maxmind = require('maxmind');
var winston = require('winston');

// Path for application config directory to be loaded by config module
process.env.NODE_CONFIG_DIR = path.join(__dirname, '/config/environment');

//Fix for PM2
var app_instance = process.env.NODE_APP_INSTANCE;
process.env.NODE_APP_INSTANCE = "";
require('config');
process.env.NODE_APP_INSTANCE = app_instance;
var config = require('./config/environment');

// Configure Winston
require('./config/winston').init();

// Initialize MaxMind
try {
  maxmind.init([
    path.resolve(__dirname, '../data/GeoIP.dat'),
    path.resolve(__dirname, '../data/GeoIPv6.dat')
  ], {indexCache: true, memoryCache: true, checkForUpdates: true});
} catch (e) {
  if (e.code === 'ENOENT') winston.error('MaxMind .dat files not found, please run `npm run update-mmdb`');
}

// Configure and connect Mongoose
//set mongoose Promise provider to bluebird
mongoose.Promise = require('bluebird');
// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Require Express App
var app = require('./config/express');

// Create Http Server
var server = http.createServer(app);

// Bootstrap the Info Service
require('./components/info/start')();

// Oauth2 Component to get token and use them during the application
//require('./components/oauth2/start')();

// Start Express server
server.listen(config.port, config.ip, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  var host = config.ip ? config.ip : 'localhost';
  console.log('Access URL:');
  console.log('------------------------------------------');
  console.log('WWW - > %s', "http://" + host + ":" + config.port);
  console.log('------------------------------------------');
});

// Populate DB with sample data
if (config.seedDB) {
  require('./config/seed');
}
