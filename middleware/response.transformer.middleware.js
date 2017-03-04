'use strict';

import transformer from '../components/transformer';

/**
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = function(req, res, next) {
  res.transform = transformer.transform;
  next();
};
