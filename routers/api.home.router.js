"use strict";

import compose from 'composable-middleware';
import * as homeRouterMiddleware from '../middleware/home.router.middleware';
import deviceDetectMiddlerware from '../middleware/mobiledetect.middleware';

/**
 *
 * @param app
 */
module.exports = compose(
  // load domain based config
  homeRouterMiddleware.loadWebsiteConfigMiddleware,
  // detect country based on ip
  homeRouterMiddleware.geoIpMiddleware,
  // detect current user device based on user-agent
  deviceDetectMiddlerware,
  // load meta data for cms pages
  homeRouterMiddleware.cmsMiddleware,
  // load configuration to be passed to client index.ejs
  homeRouterMiddleware.loadClientConfigMiddleware,
  function(req, res, next) {
    res.send(res.apiWwwConfig);
  }
);
