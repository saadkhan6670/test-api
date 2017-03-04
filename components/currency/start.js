/**
 *
 */
'use strict';


module.exports = function(app, config, request, events, memoryCache) {

  var CurrencyMethod = require('./../currency/currency.info')(app, config, request, events, memoryCache);
  var interval = 2 * 10 * 60 * 60 * 1000; // 2 hours
  var configObject = config;

  setInterval(getCurrencyMethod, interval, configObject);

  function getCurrencyMethod(configObject) {
    CurrencyMethod.getCurrencyData(configObject);
  }

};
