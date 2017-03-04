'use strict';

import compose from 'composable-middleware';
import Boom from 'boom';
import Booking from './booking.model';
import userMiddleware from '../../../middleware/user.middleware';

var BookingController = {

  /**
   * Get list of bookings
   * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
   */
  index: compose(
    userMiddleware.addUserIdToDbQuery,
    function (req, res, next) {
      delete req.dbQuery.isActive;

      Booking.find(req.dbQuery)
        .then((bookings) => {
          var bookingList = [];
          bookings.forEach(function(booking){
            bookingList.push(res.transform(booking.toJSON(), {
              removeFields: [
                'requestHeaders',
                'createdAt',
                'updatedAt',
                '__v'
              ],
              medium: 'web'
            }));
          });
          return res.status(200).json(bookingList);
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  )
};

module.exports = BookingController;
