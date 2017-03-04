'use strict';

import compose from 'composable-middleware';
import userMiddleware from '../../../middleware/user.middleware';
import _ from 'lodash';

import Air from './air.model';
import Boom from 'boom';

function addUserId(obj, user) {
  var _copy = obj;
  _copy.userId = user._id;
  return _copy;
}

var AirController = {
  book: compose(
    //extract the email from the contact details and put it in the req.body.email
    function(req, res, next) {
      if (!_.isUndefined(req.body.Contact) && !_.isUndefined(req.body.Contact.Email)) {
        req.body.email = req.body.Contact.Email.toLowerCase();
        next();
      }
      else {
        return next(Boom.badRequest('Email not specified inside Contact object'));
      }
    },
    //get or create the user based on the req.body.email and set it as req.user
    userMiddleware.getOrCreateUser,
    //save all the data!
    function (req, res, next) {
      // Format the bookingData and add the userId to it's objects
      var bookingData = {
        travellers: req.body.Traveler.map(function(traveller) { return addUserId(traveller, req.user) }),
        contact: function() { return addUserId(req.body.Contact, req.user) }(),
        billing: function() { return addUserId(req.body.BillingAddress, req.user) }()
      };

      Air.save(bookingData)
        .then((result) => {

          req.user.getInfo()
            .then((result) => {
              return res.json({
                result: result,
                user: req.user
              });
            });

        })
        .catch((err) => {
          if (err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  )
};

module.exports = AirController;
