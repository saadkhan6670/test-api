// some features require strict mode
'use strict';

import MobileDetect from 'mobile-detect';
import winston from 'winston';

/**
 * this middleware require to have wwwConfig object in req.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (req, res, next) => {
  let md = new MobileDetect(req.headers['user-agent']);
  // exit is there's no user-agent sent in the headers
  if (req.wwwConfig.device || !req.headers['user-agent']) return next();

  /**
   * Should return the media type mobile or tablet or desktop
   * @param arg MobileDetect new instance
   * @returns {string}
   */
  const isMobile = (arg) => {
    if (arg.mobile()) return arg.mobile().toLowerCase();
    if (arg.tablet()) return arg.tablet().toLowerCase();
    return 'desktop';
  };
  /**
   * Should return the operating system name
   * @param arg MobileDetect new instance
   * @returns {string}
   */
  const osType = (arg) => {
    return (arg.os() ? arg.os().toLowerCase() : null);
  };

  // return an object to the client or catch the err stack
  try {
    const device = {
      // should return {mobile, tablet, desktop}
      media: isMobile(md),
      // operating system in lowercase
      type: osType(md),
      // should return a boolean
      isMobile: !!md.mobile()
    };

    if (!req.wwwConfig.device) {
      req.wwwConfig.device = JSON.stringify(device);
    }
    next();
  } catch (err) {
    winston.log('error', 'While detecting device', {
      err: err.message,
      stack: err.stack
    });
  }
};
