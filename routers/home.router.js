"use strict";

import compose from 'composable-middleware';
import * as homeRouterMiddleware from '../middleware/home.router.middleware';
import deviceDetectMiddlerware from '../middleware/mobiledetect.middleware';
import {registerEjsHelpers} from '../middleware/ejs-helpers.middleware';

/**
 *
 * @param app
 */
module.exports = compose(
  // load domain based config
  homeRouterMiddleware.loadWebsiteConfigMiddleware,
  // load default or user current language
  homeRouterMiddleware.languageMiddleware,
  // load translation file for .ejs
  homeRouterMiddleware.loadTranslation,
  // detect country based on ip
  homeRouterMiddleware.geoIpMiddleware,
  // detect current user device based on user-agent
  deviceDetectMiddlerware,
  // load meta data for cms pages
  homeRouterMiddleware.cmsMiddleware,
  // load configuration to be passed to client index.ejs
  homeRouterMiddleware.loadClientConfigMiddleware,
  // register EJS helpers
  registerEjsHelpers,
  function(req, res, next) {

    var headers = {};
    if (!res.headersSent) {
      headers = {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store, max-stale=0, pre-check=0, post-check=0, private, must-revalidate, max-age=0, no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      };

      res.set(headers).render('index');
    }
    res.end();
  }
);
