'use strict';

// Local specific configuration
// ==================================
module.exports = {
  secure: {
    privateKey: __dirname + '/../sslcerts/server.key',
    certificate: __dirname + '/../sslcerts/server.crt'
  },

  seedDB: true,

  // MongoDB connection options 28018
  mongo: {
    uri: 'mongodb://localhost/tajawal_com_dev'
  },

  infoApi: {
    url: 'http://flight-api.tajawal.local:8080/info/web.php'
  },

  backendApi: {
    url: 'http://flight-api.tajawal.local:8080',
    version: 'v1'
  },
  hotelApi: {
    url: "http://hotel-api-dev-endpoint.tajawal.com",
    version: ""
  },
  hubApi: {
    url: "http://hub-api-dev-endpoint.tajawal.com",
    version: ""
  },
  loggingLevels: {
    error: 3,
    warn: 2,
    info: 1,
    debug: 0
  }
};
