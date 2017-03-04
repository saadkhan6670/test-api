'use strict';

import requestUtils from '../utils/req.utils';

/**
 * middleware to filter request headers only filter requests which are either type of POST or have url /auth
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function(req, res, next) {
  if (req.method != 'POST' && !/auth/.test(req.url)) {
    return next();
  }

  req.filteredHeaders = requestUtils.filterRequestHeaders(req.headers);
  next();
};
