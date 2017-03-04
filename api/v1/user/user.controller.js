'use strict';

import User from './user.model.js';
import config from '../../../config/environment';
import Boom from 'boom';
import crypto from 'crypto';
import authUtils from '../../../utils/auth.utils';
import eventEmitter from '../../../components/event_emitter';
import NewsLetterConf from '../newsletter/newsletter-conf.model';
import reqUtils from '../../../utils/req.utils';
import _ from 'lodash';
import winston from 'winston';

var UserController = {
  /**
   * Creates a new user
   */
  create: function(req, res, next) {

    User.findGuestByEmail(req.body.email.toLowerCase(), (err, user) => {

      var newUser = null;
      var body = req.body;
      var subscribe = req.body.subscribe || null;

      // if we find a user with role of guest
      // convert his acount to role => 'user'
      // and set the new password
      if (user !== null) {

        delete user.hashedPassword;
        delete user.salt;

        newUser = user;

        newUser.FirstName = req.body.FirstName;
        newUser.password = req.body.password;
        newUser.passwordConfirmation = req.body.passwordVerify;
        newUser.isGuest = false;
      }
      else {
        try {
          newUser = new User(req.body);
          newUser.password = req.body.password;
          newUser.passwordConfirmation = req.body.passwordVerify;
          newUser.requestHeaders = req.filteredHeaders;
        }
        catch (e) {
          winston.log('error', 'Error.. while creating user', {
            err: e.message,
            stack: e.stack
          });
        }
      }

      if (subscribe) {
        var lists = NewsLetterConf.get(req);

        _.each(lists, function(newsletter) {
          var freq = _.result(_.find(newsletter.frequency, {default: true}), 'key');

          newUser.subscriptions.push({
            key: newsletter.key,
            frequency: freq,
            isSubscribed: true
          });
        });
      }

      newUser.provider = 'local';
      newUser.role = 'user';
      newUser.registeredAt = new Date();

      try {
        newUser.save()
          .then((user) => {
            body['jobName'] = 'registration_email';
            body['locale'] = req.headers['x-locale'];
            body['templateData'] = {
              contact: {
                Title: user.Title || '',
                FirstName: user.FirstName || '',
                MiddleName: user.MiddleName || '',
                LastName: user.LastName || ''
              },
              baseURL: reqUtils.getBaseUrl(req)
            };
            eventEmitter.emit('create_email_job', body);
            var token = authUtils.signToken(user._id, user.role, user.email.toLowerCase());
            return res.json({token: token, expires_at: config.jwtExpiresIn});
          })
          .catch((err) => {
            if (err.isBoom) return next(err);
            else return next(Boom.wrap(err, 422));
          });
      }
      catch (e) {
        winston.log('error', 'Error.. while creating user', {
          err: e.message,
          stack: e.stack
        });
      }
    });
  },

  /**
   * Get a single user
   */
  show: function(req, res, next) {
    var userId = req.params.id;

    User.findById(userId)
      .then((user) => {
        if (!user) return next(Boom.unauthorized('invalid credentials'));
        res.json(user.profile);
      })
      .catch((err) => {
        if (err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  },

  /**
   * Updates a user
   */
  update: function(req, res, next) {
    var userId = req.user._id;
    var userData = req.body;

    //shouldn't change the email of the user
    delete userData['email'];

    User.findById(userId, '-salt -hashedPassword')
      .then((user) => {
        _.assignIn(user, userData);

        return user.save();
      })
      .then((user) => {
        res.status(200).json(res.transform(user.toJSON(), {
          removeFields: [
            'requestHeaders',
            'createdAt',
            'updatedAt',
            'registeredAt',
            '__v',
            'resetPasswordExpires',
            'resetPasswordToken',
            'resetPasswordRequestCount',
            'isEmailVerificationRequired',
            'isEmailVerified'
          ],
          medium: 'web'
        }));
      })
      .catch((err) => {
        if (err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  },

  /**
   * Change a users password
   */
  changePassword: function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId)
      .then((user) => {
        if (!user.authenticate(oldPass))
          throw Boom.unauthorized('invalid credentials');

        user.password = newPass;
        user.passwordConfirmation = newPass;
        return user.save();
      })
      .then((user) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        if (err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  },

  /**
   * Get my info
   */
  index: function(req, res, next) {
    var userId = req.user._id;
    User.findOne({_id: userId}, '-salt -hashedPassword')
      .then((user) => {
        if (!user) return next(Boom.unauthorized('invalid credentials'));
        res.status(200).json(res.transform(user.toJSON(), {
          removeFields: [
            'requestHeaders',
            'createdAt',
            'updatedAt',
            'registeredAt',
            '__v',
            'resetPasswordExpires',
            'resetPasswordToken',
            'resetPasswordRequestCount',
            'isEmailVerificationRequired',
            'isEmailVerified'
          ],
          medium: 'web'
        }));
      })
      .catch((err) => {
        if (err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  },

  /**
   * Initiate forgot password request
   */
  forgotPassword: function(req, res, next) {
    var body = req.body;
    User.findOne({email: body.email.toLowerCase()})
      .then((user) => {
        if (!user)
          throw Boom.badData('No user associated with the provided email');

        if (user.resetPasswordExpires > Date.now())
          throw Boom.forbidden('New password request cannot be initiated until the previous one expires.');

        //Creating random token for user password reset request
        var buf = crypto.randomBytes(20);
        user.resetPasswordToken = buf.toString('hex');
        user.resetPasswordExpires = Date.now() + parseInt(config.resetPasswordRequestTimeout);
        user.resetPasswordRequestCount++;

        return user.save();
      })
      .then((user) => {
        var locale = _.isUndefined(req.headers['x-locale']) ? 'en' : req.headers['x-locale'];
        body['jobName'] = 'forgot_password_email';
        body['FirstName'] = user.FirstName;
        body['locale'] = reqUtils.getLocale(locale);
        body['templateData'] = {
          contact: {
            Title: user.Title || '',
            FirstName: user.FirstName || '',
            MiddleName: user.MiddleName || '',
            LastName: user.LastName || ''
          },
          resetUrl: req.protocol + '://' + req.hostname + '/' + locale + '/reset/' + user.resetPasswordToken,
          baseURL: reqUtils.getBaseUrl(req)
        };
        eventEmitter.emit('create_email_job', body);
        res.json({token: user.resetPasswordToken});
      })
      .catch((err) => {
        if (err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  },

  /**
   * Verify forgot password request
   */
  verifyResetPassword: function(req, res, next) {
    var token = req.params.token;
    User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
      .then((user) => {
        if (!user)
          throw Boom.badData('password reset token is invalid or expired.');

        res.sendStatus(200);
      })
      .catch((err) => {
        if (err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  },

  /**
   * Reset password
   */
  resetPassword: function(req, res, next) {
    var newPass = String(req.body.password);
    var token = String(req.body.token);
    User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
      .then((user) => {
        if (!user)
          throw Boom.badData('password reset token is invalid or expired.');

        user.password = newPass;
        user.passwordConfirmation = newPass;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        return user.save();
      })
      .then((user) => {
        var body = {};
        body['jobName'] = 'reset_password_email';
        body['FirstName'] = user.FirstName;
        body['email'] = user.email.toLowerCase();
        body['locale'] = req.headers['x-locale'];
        body['templateData'] = {
          contact: {
            Title: user.Title || '',
            FirstName: user.FirstName || '',
            MiddleName: user.MiddleName || '',
            LastName: user.LastName || ''
          },
          baseURL: reqUtils.getBaseUrl(req)
        };
        eventEmitter.emit('create_email_job', body);
        var token = authUtils.signToken(user._id, user.role, user.email.toLowerCase());
        res.json({
          token: token,
          expires_at: config.jwtExpiresIn
        });
      })
      .catch((err) => {
        if (err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  }
};

module.exports = UserController;

///**
// * Authentication callback
// */
//exports.authCallback = function (req, res, next) {
//  res.redirect('/');
//};
