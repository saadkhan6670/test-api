'use strict';

// Production specific configuration
// =================================
module.exports = {
  mongo: {
    uri: 'mongodb://localhost/tajawal_com'
  },

  infoApi: {
    url: 'http://flight-api-live-endpoint.tajawal.com/info/web.php'
  },

  backendApi: {
    url: 'http://flight-api-live-endpoint.tajawal.com',
    version: 'v1'
  },
  hotelApi: {
    url: "http://hotel-api-live-endpoint.tajawal.com",
    version: ""
  },
  hubApi: {
    url: "http://hub-api-live-endpoint.tajawal.com",
    version: ""
  },
  loggingLevels: {
    error: 1,
    debug: 0
  }
};
