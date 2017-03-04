'use strict';

import Contact from '../contact/contact.model';
import Traveller from '../traveller/traveller.model';
import Billing from '../billing/billing.model';
import Booking from '../booking/booking.model';

import Promise from 'bluebird';

var Air = {
  /**
   * Save air information
   *
   * @param {Object} airInfo -> { travellers: [], contact: {}, billing: {} }
   * @return {Promise}
   * @api public
   */
  save: function (airInfo) {
    return Promise.props({
      billing: Billing.create(airInfo.billing),
      contact: Contact.create(airInfo.contact),
      travellers: Traveller.create(airInfo.travellers),
      booking: Booking.create(airInfo.booking)
    });
  }
};

module.exports = Air;
