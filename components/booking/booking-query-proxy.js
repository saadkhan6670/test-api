'use strict';

import _ from 'lodash';

module.exports = function(_req, AppId) {

  var isGetBooking = (
      _.includes(_req.path, '/air/flight/my-booking') ||
      _.includes(_req.path, '/air/flight/book') ||
      _.includes(_req.path, '/api/hotel/booking')
    ) && _req.method === 'GET';
  if (isGetBooking) {

    // it -> should get a single booking when `BookingNr` and `Uuid` are passed as query params
    // it -> should work if `loggedIn` and if not `loggedIn`
    var BookingNr = _.get(_req.query, 'BookingNr', false);
    var Uuid = _.get(_req.query, 'Uuid', false);
    if (BookingNr && Uuid) {
      return _req.query;
    }

    // it -> should get a list of bookings based on `headers[x-device-id]` and pass it as req.query.Guid
    // it -> should work if `loggedIn` and if not `loggedIn`
    var Guid = _.get(_req.query, 'Guid', '');
    if (Guid) {
      _req.query['Guid'] = Guid;
      return _req.query;
    }

    // it -> should get a listing of bookings based on the `user` from the token and the `x-app-id` header
    // it -> should work only if it's logged in
    var _userEmail = _.get(_req.user, 'email', '');

    if (_.isUndefined(AppId)) {
      AppId = _.get(_req.headers, 'x-app-id');
    }

    if (_userEmail && AppId) {
      _req.query['Email'] = _userEmail;
      _req.query['AppId'] = AppId;

      return _req.query;
    }
  }

  return _req.query;

};
