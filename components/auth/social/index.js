'use strict';

import twitter from './social.twitter';
import facebook from './social.facebook';
import routes from './social.routes';

module.exports = {
  // twitter strategy only
  twitter: twitter,
  // fb strategy only
  facebook: facebook,

  // social twitter - fb router
  routes: routes
};
