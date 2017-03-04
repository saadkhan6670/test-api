'use strict';

// Development specific configuration
// ==================================
module.exports = {

  seedDB: false,

  // MongoDB connection options 28018
  mongo: {
    uri: 'mongodb://localhost/tajawal_com_dev'
  },
  infoApi: {
    url: 'http://flight-api-dev-endpoint.tajawal.com/info/web.php'
  },
  backendApi: {
    url: 'http://flight-api-dev-endpoint.tajawal.com',
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
