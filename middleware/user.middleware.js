'use strict';

import User from '../api/v1/user/user.model';
import _ from 'lodash';
import Boom from 'boom';

/**
 * adds the userId param to req.dbQuery if the user role is 'user'
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.addUserIdToDbQuery = function (req, res, next) {
  var query = req.dbQuery || {};
  // if the user is a 'user', get only the 'active' records related to him
  if (req.user) {
    query.userId = req.user._id;
    query.isActive = true;
    req.dbQuery = query;
    next();
  }
  else {
    return next(Boom.badRequest('addUserIdToDbQuery error'));
  }
};

/**
 * adds the userId param to req.body if the user role is 'user'
 * otherwise it should be sent with the body from the client
 */
exports.addUserIdToBodyPayload = function(req, res, next) {
  var payload = req.body;
  // user scenario
  if (req.user) {
    payload.userId = req.user._id;
    req.body = payload;
    next();
  }
  else {
    return next(Boom.badRequest('addUserIdToBodyPayload error'));
  }

};

/**
 * adds the user object to req if the email is present in the req.body
 * it either gets it from the db or create a new one, the next middlware does not
 * care about what happens here, it just uses req.user...
 */
exports.getOrCreateUser = function (req, res, next) {
  if (!_.isUndefined(req.body.email)) {
    User.getOrCreate(req.body.email.toLowerCase(), req.headers)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        }
        else {
          return next(Boom.badRequest('something went wrong'));
        }
      })
      .catch((err) => {
        if(err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      })
  }
};
