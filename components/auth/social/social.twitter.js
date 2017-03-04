"use strict";

import passport from 'passport';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import TwitterTokenStrategy from 'passport-twitter-token';
import socialAuthHelper from './social.utils';
import User from '../../../api/v1/user/user.model';

/**
 * Twitter authentication strategy
 * @param config
 */
exports.setup = function(config) {

  //twitter strategy using token
  passport.use(new TwitterTokenStrategy(config,
    function (req, token, tokenSecret, profile, done) {
      socialAuthHelper.twitterUserCreation(req, token, tokenSecret, profile._json, User, function (err, user) {
        if (err) {
          return done(err);
        }

        done(null, user);
      })
    }
  ));

  //twitter strategy using twitter credentials
  passport.use(new TwitterStrategy(config,
    function(req, token, tokenSecret, profile, done) {
      process.nextTick(function() {
        socialAuthHelper.twitterUserCreation(req, token, tokenSecret, profile._json, User, function (err, user) {
          if (err) {
            return done(err);
          }

          done(null, user);
        })
      });
    }
  ));
};
