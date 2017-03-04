'use strict';

import config from '../config/environment';

module.exports = {
  /**
   * Provide domain based configurations for passport social strategies
   * @param envId
   * @returns {{facebook: (*|UserSchema.facebook|{}|module.exports.facebook|{enableProof, clientID, clientSecret, callbackURL, passReqToCallback, profileFields}|facebook), twitter: (*|UserSchema.twitter|{}|string|string|string)}}
     */
  getStrategyConfig: function (envId) {
    var strategyConfig = {
      facebook: config.facebook,
      twitter: config.twitter
    };

    switch (envId) {
      case 'devAe':
      case 'liveAe':
        strategyConfig = {
          facebook: config.facebook_ae,
          twitter: config.twitter_ae
        };
        break;
      case 'devSa':
      case 'liveSa':
        strategyConfig = {
          facebook: config.facebook_sa,
          twitter: config.twitter_sa
        };
        break;
    }

    return strategyConfig;
  }
};
