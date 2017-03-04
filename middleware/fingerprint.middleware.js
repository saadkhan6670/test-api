'use strict';

/**
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = function(req, res, next) {
  req.fingerprint = req.header('x-fp') || null;
  next();
};
