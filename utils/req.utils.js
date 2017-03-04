'use strict';

var whiteList = ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query', 'body'];
var removeFields = ['cookie'];

var requestFilterFn = function(req, propName) {
  return req[propName];
};

var RequestFilter = {
  /**
   *
   * @param originalObj
   * @returns {*}
   */
  filterObject: (originalObj) => {
    var obj = {};
    var fieldsSet = false;

    [].concat(whiteList).forEach(function(propName) {
      var value = requestFilterFn(originalObj, propName);

      if (typeof (value) !== 'undefined') {
        obj[propName] = value;
        if (propName == 'headers') {
          delete obj[propName].cookie;
        }
        fieldsSet = true;
      }
    });

    return fieldsSet ? obj : undefined;
  },
  /**
   *
   * @param originalObj
   * @returns {*}
   */
  filterRequestHeaders: (originalObj) => {
    removeFields.forEach(function(propName) {
      delete originalObj[propName];
    });

    return originalObj;
  },

  /**
   *
   * @param req
   * @returns {string}
   */
  getBaseUrl: function(req) {
    return req.protocol + '://' + req.hostname;
  },

  getLocale: function (locale) {
    if (!locale) {
      return "en";
    }

    locale = locale.toLowerCase();
    if (locale.indexOf('ar') > -1) {
      return 'ar'
    }
    else if (locale.indexOf('en') > -1) {
      return 'en'
    }

    return locale;
  }
};

module.exports = RequestFilter;
