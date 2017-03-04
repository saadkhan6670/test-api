/**
 *
 * @param req
 * @returns {*}
 */
'use strict';

import config from '../config/environment';
import _ from 'lodash';

/**
 *
 * @param app
 * @returns {{getApiRequestUrl: getApiRequestUrl, getCMSApiRequestUrl: getCMSApiRequestUrl, getMobileRequestUrl: getMobileRequestUrl}}
 */
export default function (app) {

  /**
   *
   * @param request
   * @returns {*}
   */
  var getApiRequestUrl = function (request) {
    var rUrl = request.url;
    var isHotelApi = _.startsWith(rUrl, '/api/hotel/');
    var apiUrl = '';
    var requestUrl = '';
    // if it match hotel api string
    if (isHotelApi) {
      apiUrl = config.getHotelApiUrl();
      requestUrl = apiUrl + rUrl.replace('/api/hotel/', '/');
      return requestUrl;
    }

    var isHublApi = _.startsWith(rUrl, '/api/hub/');

    if (isHublApi) {
      apiUrl = config.getHubApiUrl();
      requestUrl = apiUrl + rUrl.replace('/api/hub/', '/');
      return requestUrl;
    }

    apiUrl = config.getBackendApiUrl();
    requestUrl = apiUrl + rUrl.replace('/api/', '/');
    return requestUrl;
  };

  /**
   *
   * @param request
   * @returns {*}
   */
  var getMobileRequestUrl = function (request) {
    var rUrl = request.url;
    var isHotelApi = _.startsWith(rUrl, '/api/m/hotel/');
    var apiUrl = '';
    var requestUrl = '';
    // if it match hotel api string
    if (isHotelApi) {
      apiUrl = config.getHotelApiUrl();
      requestUrl = apiUrl + rUrl.replace('/api/m/hotel/', '/');
      return requestUrl;
    }

    var isHublApi = _.startsWith(rUrl, '/api/m/hub/');

    if (isHublApi) {
      apiUrl = config.getHubApiUrl();
      requestUrl = apiUrl + rUrl.replace('/api/m/hub/', '/');
      return requestUrl;
    }

    apiUrl = config.getBackendApiUrl();
    requestUrl = apiUrl + rUrl.replace('/api/m/', '/');
    return requestUrl;
  };

  /**
   *
   * @param request
   * @returns {*}
   */
  var getCMSApiRequestUrl = function (request) {
    var apiUrl = config.cms.url;
    var rUrl = request.url;
    var requestUrl = apiUrl + rUrl.replace('/cms/', '/');
    return requestUrl;
  };
  return {
    getApiRequestUrl: getApiRequestUrl,
    getCMSApiRequestUrl: getCMSApiRequestUrl,
    getMobileRequestUrl: getMobileRequestUrl
  };
}
