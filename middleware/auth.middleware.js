'use strict';

import config from "../config/environment";
import expressJwt from "express-jwt";
import compose from "composable-middleware";
import User from "../api/v1/user/user.model";
import Boom from "boom";
import authUtils from "../utils/auth.utils";
import webConfig from "../config/website";
import _ from 'lodash';

var validateJwt = expressJwt({
  secret: config.secrets.session
});

// middleware for authentication
module.exports = {

  /**
   * Attaches the user object to the request if authenticated
   * Otherwise returns 403
   * @returns {Authenticator}
     */
  isAuthenticated: function() {
    return compose()
    // Validate jwt
      .use(function(req, res, next) {
        // allow token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('token')) {
          req.headers.authorization = 'Bearer ' + req.query['token'];
        }
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function(req, res, next) {
        User.findById(req.user._id, function(err, user) {
          if (err) return next(Boom.wrap(err, 422));
          if (!user) return next(Boom.unauthorized('Invalid credentials'));

          req.user = user;
          next();
        });
      });
  },

  /**
   * Checks if the user role meets the minimum requirements of the route
   * @param roleRequired
   * @returns {Authenticator}
     */
  hasRole: function(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
      .use(this.isAuthenticated())
      .use(function meetsRequirements(req, res, next) {
        if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
          next();
        } else {
          return next(Boom.forbidden('try again'));
        }
      });
  },

  /**
   * Set token cookie directly for Auth strategies
   * @param req
   * @param res
   * @param next
     */
  generateTokenCookie: function (req, res, next) {
    if (!req.user) return Boom.notFound('Something went wrong, please try again.');

    var user = req.user;
    req.token = authUtils.signToken(user._id, user.role, user.email.toLowerCase());

    next();
  },

  setTokenCookie: function (req, res, next) {
    var configData = webConfig(req);
    var namespace = _.get(configData, 'ns', 'tjwl_local');
    //For backward compatiblity
    res.cookie('token', JSON.stringify(req.token));
    res.cookie(namespace + '.token', JSON.stringify(req.token));
    next();
  },

  /**
   * Send response after successful local auth
   * @returns {Authenticator}
     */
  sendLocalAuthRes: function() {
    return compose()
      .use(this.generateTokenCookie)
      .use(function(req, res, next) {
        res.json({
          token: req.token,
          expires_at: config.jwtExpiresIn
        });
      });
  },

  /**
   * Send response after successful social auth
   * @returns {Authenticator}
     */
  sendSocialAuthRes: function() {
    return compose()
      .use(this.generateTokenCookie)
      .use(this.setTokenCookie)
      .use(function(req, res, next) {

        var query = req.query;
        // either we need to redirect after successful auth or send token in response
        if (query.redirect === '0') {
          res.json({
            token: req.token,
            expires_at: config.jwtExpiresIn
          });
          return;
        }
        if (!res.headersSent) {
          res.redirect('/#');
        }
      });
  }
};
