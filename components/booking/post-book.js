
"use strict";

import User from '../../api/v1/user/user.model';
import winston from 'winston';
import eventEmitter from '../../components/event_emitter';
import _ from 'lodash';
import moment from 'moment';
moment().format();

function addUserId(obj, user) {
  var _copy = obj;
  _copy.userId = user._id;
  return _copy;
}

module.exports = function(resBody) {

  var newUser = {};
  var bookingData = {};
  var data = {};
  //get the user by email
  var requestHeaders = resBody.requestHeaders;
  User.getOrCreate(resBody.email.toLowerCase(), requestHeaders)
    .then((user) => {
      newUser = user;

      if (user.isNew) {
        var mailData = {
          jobName: 'guest_account_email',
          email: user.email.toLowerCase(),
          locale: resBody.locale,
          templateData: {
            contact: resBody.contact,
            activationUrl: resBody.baseUrl + '/' + resBody.locale + '/register',
            baseURL: resBody.baseUrl
          }
        };
        eventEmitter.emit('create_email_job', mailData);
      }

      if(resBody.booking_type === 'flight'){
        var legInfo = resBody.seat_data.Quote.Flight.Leg.map(function(leg) {
          return {
            Origin: leg.Path[0],
            Destination: _.last(leg.Path),
            DepartureTime: leg.DepartureTime,
            Index: leg.Index
          };
        });
        // compose the booking data
        bookingData = {
          travellers: (function() {
            _.each(resBody.traveler, function(traveller) {
              traveller.requestHeaders = requestHeaders;
              addUserId(traveller, user)
            });
            return resBody.traveler;
          })(),
          contact: (function() {
            resBody.contact.requestHeaders = requestHeaders;
            return addUserId(resBody.contact, user)
          })(),
          billing: (function() {
            resBody.billing_address.requestHeaders = requestHeaders;
            return addUserId(resBody.billing_address, user)
          })(),
          booking: {
            userId: user._id,
            booking_nr: resBody.booking_nr,
            Uuid: resBody.Uuid,
            TripType: resBody.search_info.Attribute.SearchType,
            TravellerCount: resBody.traveler.length,
            Leg: legInfo,
            requestHeaders: requestHeaders
          }
        };

        _.each(bookingData.booking.Leg, function(leg) {
          leg.DepartureDate = moment(leg.DepartureTime).format("DD-MM-YYYY");
        });

        data = {
          jobName: 'ticket_under_process_email',
          email: newUser.email.toLowerCase(),
          locale: resBody.locale,
          templateData: {
            contact: resBody.contact,
            bookingDetails: bookingData,
            bookingUrl: resBody.baseUrl + '/' + resBody.locale + '/flight/booking/' + bookingData.booking.booking_nr + '/' + bookingData.booking.Uuid,
            baseURL: resBody.baseUrl
          }
        };
      }
      else if(resBody.booking_type === 'hotel'){
        bookingData = _.pick(resBody, ['booking_nr', 'Uuid', 'status', 'contact', 'totals', 'guest']);

        data = {
          jobName: 'room_under_process',
          email: newUser.email.toLowerCase(),
          locale: resBody.locale,
          templateData: {
            contact: resBody.contact,
            bookingDetails: resBody,
            bookingUrl: resBody.baseUrl + '/' + resBody.locale + '/hotel/booking/' + resBody.booking_nr + '/' + resBody.Uuid,
            baseURL: resBody.baseUrl
          }
        };
      }
      eventEmitter.emit('create_email_job', data);

      return null;
    })
    .catch((err) => {
      winston.log('error', 'Error.. while saving booking', {
        err: err.message,
        stack: err.stack
      });
    });

};
