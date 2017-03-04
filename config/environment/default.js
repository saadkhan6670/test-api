var path = require('path');
var userRoles = require('../constants/user.roles');

module.exports = {

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: 3000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Cache Store to be used
  cacheStore: 'memory',

  // Cache TTL: in seconds
  cacheTTL: (60 * 60 * 2), // 2 hours by default

  // List of user roles
  userRoles: [userRoles.guest, userRoles.user],

  // MongoDB connection options
  mongo: {
    options: {
      server: {
        socketOptions: {
          keepAlive: 300000,
          connectTimeoutMS: 30000
        },
        poolSize: 25,
        sslValidate: false
      },
      replset: {
        socketOptions: {
          keepAlive: 300000,
          connectTimeoutMS: 30000
        },
        poolSize: 25,
        sslValidate: false
      },
      db: {
        safe: true
      }
    }
  },

  local: {
    usernameField: 'email',
    passwordField: 'password'
  },

  facebook: {
    enableProof: false,
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: '/auth/social/facebook/callback',
    passReqToCallback: true,
    profileFields: ['id', 'email', 'first_name', 'gender', 'middle_name', 'last_name']
  },
  facebook_ae: {
    enableProof: false,
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: '/auth/social/facebook/callback',
    passReqToCallback: true,
    profileFields: ['id', 'email', 'first_name', 'gender', 'middle_name', 'last_name']
  },
  facebook_sa: {
    enableProof: false,
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: '/auth/social/facebook/callback',
    passReqToCallback: true,
    profileFields: ['id', 'email', 'first_name', 'gender', 'middle_name', 'last_name']
  },
  twitter: {
    consumerKey: 'id',
    consumerSecret: 'secret',
    passReqToCallback: true,
    callbackURL: '/auth/social/twitter/callback'
  },
  twitter_ae: {
    consumerKey: 'id',
    consumerSecret: 'secret',
    passReqToCallback: true,
    callbackURL: '/auth/social/twitter/callback'
  },
  twitter_sa: {
    consumerKey: 'id',
    consumerSecret: 'secret',
    passReqToCallback: true,
    callbackURL: '/auth/social/twitter/callback'
  },

  getBackendApiUrl: function () {
    return this.backendApi.url;
  },
  getHotelApiUrl: function () {
    //this.hotelApi.version;
    return this.hotelApi.url;
  },
  getHubApiUrl: function () {
    return this.hubApi.url;
  },
  // Reset password request expiry duration in milliseconds
  resetPasswordRequestTimeout: 3600000,

  //File path for logging
  logFilePath: './www_log.log',

  //Max file size for logging
  logFileSize: 10485760,

  //Default country code
  defaultCountryCode: 'AE'
};
