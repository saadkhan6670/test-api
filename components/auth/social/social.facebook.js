'use strict';

import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import socialAuthHelper from './social.utils';
import FacebookTokenStrategy from 'passport-facebook-token';
import User from '../../../api/v1/user/user.model';

/**
 * Facebook authentication strategy
 * @param config
 */
exports.setup = function (config) {

  // facebook auth using token
  passport.use(new FacebookTokenStrategy(config,
    function (req, accessToken, refreshToken, profile, done) {
      socialAuthHelper.facebookUserCreation(req, profile._json, accessToken, User, function (err, user) {
        if (err) {
          return done(err);
        }

        done(null, user);
      })
    }
  ));


  //facebook auth using facebook credentials
  passport.use(new FacebookStrategy(config,
    function (req, token, tokenSecret, profile, done) {
      process.nextTick(function () {
        socialAuthHelper.facebookUserCreation(req, profile._json, token, User, function (err, user) {
          if (err) {
            return done(err);
          }

          done(null, user);
        });
      });
    }
  ));
};
