'use strict';

import _ from 'lodash';

module.exports = {
  /**
   *
   * @param obj
   * @param options
   * options.removeFields: {Array} array of fields that should be reomved from object (optional)
   * extendFields: {Object} fields that will be added in object (optional)
   * medium: {String} web or mobile (optional)
   * (default: web)
   * @returns {*}
   *
   */
  transform: (obj, options) => {
    if (_.isUndefined(options)) {
      return obj;
    }

    switch (options.medium) {
      case 'mobile':
        obj = transformForMobile(obj);
        break;
      default:
        obj = transformForWeb(obj);
    }

    // remove fields from object
    if (options.removeFields && _.isArray(options.removeFields)) {
      obj = removeFields(obj, options.removeFields);
    }

    //extend fields to object
    if (options.extendFields && _.isPlainObject(options.extendFields)) {
      obj = extendFields(obj, options.extendFields);
    }

    return obj;
  }
};

/**
 *
 * @param obj
 * @returns {*}
 */
function transformForWeb(obj) {
  return obj;
}

/**
 *
 * @param obj
 * @returns {*}
 */

function transformForMobile(obj) {
  return obj;
}

/**
 *
 * @param obj
 * @param fields
 */
function extendFields(obj, fields) {
  return _.assignIn(obj, fields);
}

/**
 *
 * @param obj
 * @param fields
 * @returns {{}}
 */
function removeFields(obj, fields) {
  return _.omit(obj, fields);
}
