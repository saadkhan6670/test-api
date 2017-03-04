import ms from 'ms';

module.exports = function() {

  var interval = ms('15m');

  var infoMethods = require('./api.info');

  infoMethods.getApiInfo();

  function intervalConfig() {
    var intervalCon = setInterval(() => {
      infoMethods.getApiInfo();
      clearInterval(intervalCon);
      intervalConfig();
    }, interval);
    // exit when the source of truth unchanged
    intervalCon.unref();
  }
  intervalConfig();

};
