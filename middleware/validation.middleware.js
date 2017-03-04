'use strict';

import validation from '../utils/validation.utils';
import Boom from 'boom';

/**
 * adds the _id param to req.dbQuery if the it's valid
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.validateAndSetIdParam = function (req, res, next) {
  if (validation.isValidObjectID(req.params.id)) {
    req.dbQuery = { _id: req.params.id };
    return next();
  }
  else {
    return next(Boom.badRequest('invalid id'));
  }
};

/**
 * check password and passwordVerify matching
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.validatePasswordVerify = function (req, res, next) {
  if (!req.body.passwordVerify) {
    let message = 'Password verification not specified.';
    return next(Boom.badData(message, {
      password: {
        message: message
      }
    }))
  }
  else if (req.body.passwordVerify !== req.body.password) {
    let message = 'Password verification mismatch.';
    return next(Boom.badData(message, {
      passwordVerify: {
        message: message
      }
    }));
  }
  else {
    return next();
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.validatePasswordLength = function (req, res, next) {
  if (req.body.password.length < 5) {
    let message = 'Password must be at least 5 characters.';
    return next(Boom.badData(message, {
      passwordVerify: {
        message: message
      }
    }));
  }
  else {
    return next();
  }
};
