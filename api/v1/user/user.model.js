'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import timestamps from 'mongoose-timestamp';
import crypto from 'crypto';
var authTypes = ['github', 'twitter', 'facebook', 'google'];
import Promise from 'bluebird';
import sanitizer from 'sanitizer';
import softDelete from 'node-mongoose-soft-delete';
import validator from '../../../components/validators';
import uniqueValidator from 'mongoose-unique-validator';
import userRoles from '../../../config/constants/user.roles';

import Billing from '../billing/billing.model';
import Traveller from '../traveller/traveller.model';
import Contact from '../contact/contact.model';
import Booking from '../booking/booking.model';
import _ from 'lodash';

var UserSchema = new Schema({
  email: {type: String, unique: true, uniqueCaseInsensitive: true, validate: validator.isEmail('Email should be valid.')},
  appId: Number,
  role: {
    type: String,
    default: 'user',
    enum: _.values(userRoles)
  },
  isEnabled: {type: Boolean, default: true},
  isEmailVerified: {type: Boolean, default: false},
  isEmailVerificationRequired: {type: Boolean, default: false},
  lastLoginAt: Date,
  isGuest: {type: Boolean, default: true},
  registeredAt: Date,

  // User Profile data
  Title: String,
  FirstName: {type: String},
  MiddleName: {type: String},
  LastName: {type: String},
  Gender: String,

  //news letter subscriptions
  subscriptions: [],

  hashedPassword: String,
  provider: String,
  salt: String,
  twitter: {},
  facebook: {},
  google: {},
  github: {},

  //for password reset request
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  resetPasswordRequestCount: {type: Number, default: 0},
  requestHeaders: {}
}, {collection: 'www_user'});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

UserSchema.virtual('passwordConfirmation')
  .get(function() {
    return this._passwordConfirmation;
  })
  .set(function(value) {
    this._passwordConfirmation = value;
  });

UserSchema.virtual('isNew')
  .get(function() {
    return this._isNew;
  })
  .set(function(value) {
    this._isNew = value;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'FirstName': this.FirstName,
      'LastName': this.LastName,
      'role': this.role,
      'email': this.email
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;

    if (this._password || this._passwordConfirmation) {
      if (this._password.length < 5) {
        this.invalidate('password', 'Password must be at least 5 characters.');
      }
      if (this._password !== this._passwordConfirmation) {
        this.invalidate('passwordConfirmation', 'Password verification mismatch.');
      }
    }

    if (hashedPassword.length == 0) {
      this.invalidate('password', 'Password can not be blank');
    }
  }, null);

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {

    this.email = this.email.toLowerCase();
    this.FirstName = sanitizer.escape(sanitizer.sanitize(this.FirstName));
    this.MiddleName = sanitizer.escape(sanitizer.sanitize(this.MiddleName));
    this.LastName = sanitizer.escape(sanitizer.sanitize(this.LastName));

    if (!this.isNew) return next();

    if (this.isGuest && this.role === userRoles.user) this.isGuest = false;
    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else {
      next();
    }
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  /**
   * Get billing information for User instance
   *
   * @return {Promise}
   * @api public
   */
  getBillingInfo: function() {
    return Billing.find({userId: this._id}).exec();
  },

  /**
   * Get active billing information for User instance
   *
   * @return {Promise}
   * @api public
   */
  getActiveBillingInfo: function() {
    return Billing.find({userId: this._id, isActive: true}).exec();
  },

  /**
   * Get travellers information for User instance
   *
   * @return {Promise}
   * @api public
   */
  getTravellers: function() {
    return Traveller.find({userId: this._id}).exec();
  },

  /**
   * Get active travellers information for User instance
   *
   * @return {Promise}
   * @api public
   */
  getActiveTravellers: function() {
    return Traveller.find({userId: this._id, isActive: true}).exec();
  },

  /**
   * Get contact information for User instance
   *
   * @return {Promise}
   * @api public
   */
  getContacts: function() {
    return Contact.find({userId: this._id}).exec();
  },

  /**
   * Get active contact information for User instance
   *
   * @return {Promise}
   * @api public
   */
  getActiveContact: function() {
    return Contact.findOne({userId: this._id, isActive: true}).exec();
  },

  /**
   * Get bookings
   *
   * @return {Promise}
   * @api public
   */
  getBookings: function() {
    return Booking.find({userId: this._id}).exec();
  },

  /**
   * Get all information related to user
   * travellers | contact | billing
   * @return {Promise}
   * @api public
   */
  getInfo: function() {
    return Promise.props({
      billing: Billing.find({userId: this._id}).exec(),
      contact: Contact.find({userId: this._id}).exec(),
      travellers: Traveller.find({userId: this._id}).exec()
    });
  }
};

/**
 * Statics
 */
UserSchema.statics = {
  findByEmail: function(email, callback) {
    if (_.isUndefined(email) && email.length) throw new Error('Email not specified');
    var condition = {
      $or: [
        //{email: {$regex: new RegExp(email, 'i')}},
        {email: email.toLowerCase()}
      ]
    };
    if (!_.isUndefined(callback)) return User.findOne(condition, callback);
    else return User.findOne(condition).exec();
  },

  findGuestByEmail: function(email, callback) {
    if (_.isUndefined(email) && email.length) throw new Error('Email not specified');
    if (!_.isUndefined(callback)) return User.findOne({email: email.toLowerCase(), role: userRoles.guest}, callback);
    else return User.findOne({email: email.toLowerCase(), role: userRoles.guest}).exec();
  },

  getOrCreate: function(email, requestHeaders) {
    // validate the email before starting
    if (_.isUndefined(email) && !email.length) {
      console.log('Email not specified');
      return null;
    }

    // create a Promise that will get us the user, no matter if it's already existing or newly created
    return new Promise(function(resolve, reject) {
      // findByEmail then
      User.findByEmail(email)
        .then((user) => {
          //the user has been found return it
          if (user) resolve(user);
          else {
            // create a new user and return it
            var password = crypto.randomBytes(16).toString('base64');
            User.create({
                email: email.toLowerCase(),
                requestHeaders: requestHeaders,
                password: password,
                passwordConfirmation: password,
                role: userRoles.guest
              })
              .then((user) => {
                user.isNew = true;
                resolve(user);
              })
              .catch((err) => {
                reject(err);
              });
          }

          return null;
        })
        .catch((err) => {
          reject(err);
        });
    })
  }
};

UserSchema.plugin(timestamps);
UserSchema.plugin(softDelete);
UserSchema.plugin(uniqueValidator, {message: 'User already exist for the provided {PATH}.'});
let User = module.exports = mongoose.model('User', UserSchema);
