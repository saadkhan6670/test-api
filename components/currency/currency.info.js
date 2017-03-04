'use strict';

import {getApiInfo} from '../info/api.info';

module.exports = function(app, config, request, events, memoryCache) {

  var CurrencyInfo = null;
  var ttl = 2 * 10 * 60 * 60 * 1000; // 2 hour in ms
  var key = 'CurrencyInfoObject';


  var makeRequest = function(link) {
    var ApiConfig = getApiInfo();
    var ApiHeaders = ApiConfig ? ApiConfig.Headers : {};

    var syncRequest = require('sync-request');
    var res = syncRequest('GET', link, {
      headers: ApiHeaders
    });
    CurrencyInfo = JSON.parse(res.getBody('utf8'));
    return CurrencyInfo;
  };

  var setCurrencyInfoCache = function(CurrencyInfo) {
    memoryCache.put(key, CurrencyInfo, ttl);

    return CurrencyInfo;
  };

  // Get API information from direct link
  var getCurrency = function(config) {

    var CurrencyInfo = memoryCache.get(key);

    if (CurrencyInfo != null) {
      // is cached
      return CurrencyInfo;
    }

    var ApiInfo = getApiInfo();
    var CurrencyURL = ApiInfo.ApiUrl + 'system/currency/list';
    // get new config
    CurrencyInfo = makeRequest(CurrencyURL, ApiInfo.Headers);
    setCurrencyInfoCache(CurrencyInfo);
    return CurrencyInfo;
  };

  return {
    getCurrencyData: getCurrency
  }

};
