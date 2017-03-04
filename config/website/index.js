'use strict';

import _ from 'lodash';
import * as utils from './utils.website';
import baseConfig from './base';

/**
 *
 * @param req
 */
module.exports = function(req) {
  var loadedConfigObject = utils.getDomainConfig(req);
  // it merge base object with domain config based on include and replace model
  return _.mergeWith(baseConfig(req), loadedConfigObject, function(objValue, srcValue) {
    if (srcValue) {
      // if destination value is array replace it with src value
      if (_.isArray(objValue)) {
        return srcValue;
      }
      // else merge destination value and src value
      else {
        _.merge(objValue, srcValue);
      }
    }

    else {
      return objValue;
    }
  });
};
