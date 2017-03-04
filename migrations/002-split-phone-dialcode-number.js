/**
 * @title Split phone in Dialcode + Number in Contact model
 * @description This migration script will take the `Phone` field
 *              and it will split it in `DialCode` `Number` under the `phoneNumber` field
 * @dependencies Contact.model | country-list.json
 */

var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');
var winston = require('winston');
var countryListPath = path.resolve(__dirname, '../api/v1/system/country/country-list-en.json');
var countryList = JSON.parse(require('fs').readFileSync(countryListPath, 'utf8'));
var dialCodes = _.uniq(_.sortBy(_.map(countryList, function getNumericDialCode(country){
  return country.DialCode.replace('+','').replace('-', '');
}), function sortBy(value) { return value }));

var Contact = require('../api/v1/contact/contact.model');

exports.up = function(next){

  var promises = [];

  Contact.find({}, function(err, data) {
    data.forEach(function(contact, index) {
      if (contact.Phone) {
        var rawPhone = contact.Phone.replace('+', '').replace('-', '').replace(/\s/g, '');
        var dialCode = '';
        var number = '';
        var numberChars = '';

        for (var i = 0; i < rawPhone.length; i++) {
          numberChars += rawPhone.charAt(i);
          if (_.includes(dialCodes, numberChars)) {
            dialCode = _.result(_.find(countryList, function(country) {
              return country.DialCode.replace('+','').replace('-', '') === numberChars;
            }), 'DialCode');

            number = rawPhone.substr(i + 1, rawPhone.length);
          }
        }

        contact.phoneNumber = { //@todo rename to Phone once the apps transitioned to this field
          DialCode: dialCode,
          Number: number
        };

        contact.Phone = undefined;

        promises.push(contact.save());
      }
    });

    Promise.all(promises)
      .then(function() {
        next();
        winston.log('info', 'Migration 002-split-phone-dialcode-number UP success');
      })
      .catch(function (err) {
        winston.log('error', err);
      });
  });
};

exports.down = function(next){

  var promises = [];

  Contact.find({}, function(err, data) {
    data.forEach(function(contact, index) {

      if (contact.phoneNumber) {
        contact.Phone = _.result(contact.phoneNumber, 'DialCode', '') + _.result(contact.phoneNumber, 'Number', '');

        contact.phoneNumber = undefined;

        promises.push(contact.save());
      }
    });

    Promise.all(promises)
      .then(function(res) {
        next();
        winston.log('info', 'Migration 002-split-phone-dialcode-number DOWN success');
      })
      .catch(function (err) {
        winston.log('error', err);
      });
  });
};
