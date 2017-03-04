'use strict';

import * as utils from '../config/website/utils.website';
import authComponent from '../components/auth';
import passportUtils from '../utils/passport.utils';

/**
 * Setting up Passport Configuration for social strategies
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
  if (/auth\/social/.test(req.url)) {
    // set the domain to be used further by web-config
    var envId = utils.getDomainEnv(req);
    var strategyConfig = passportUtils.getStrategyConfig(envId);
    authComponent.social.facebook.setup(strategyConfig.facebook);
    authComponent.social.twitter.setup(strategyConfig.twitter);
    next();
  } else {
    next()
  }
};
