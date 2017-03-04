'use strict';

import _ from 'lodash';

module.exports = {
  /**
   *
   * @param headers
   * @param key
   * @param defaultValue
   * @returns {*}
     */
  getHeader: function (headers, key, defaultValue) {
    if (_.isUndefined(defaultValue)) {
      defaultValue = '';
    }
    return _.get(headers, key, defaultValue);
  },

  /**
   *
   * @param data
   * @returns {string}
     */
  getBody: function (data) {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data);
  }
};
