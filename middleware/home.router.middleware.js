'use strict';

import winston from "winston";
import maxmind from "maxmind";
import path from "path";
import fs from "fs";
import config from "../config/environment";
import webConfig from "../config/website";
import * as cmsUtils from "../utils/cms.utils";
import languageHelper from "../helpers/language.helper";
import _ from "lodash";
import {minify} from "html-minifier";
import currencyUtils from "../utils/currency.utils";

export function loadWebsiteConfigMiddleware(req, res, next) {
  // set locale either from cookie or config
  var configData = webConfig(req);
  const env = req.app.get('env');

  if (env !== 'local') {
    // resolve the client folder based on the website Config
    var root = path.resolve(req.app.get('clientsRoot'), configData.clientDir);
    try {
      fs.accessSync(root, fs.F_OK);
      // Do something
      req.app.set('appRootPath', root);
    } catch (e) {
      // resolve default client
      root = path.resolve(req.app.get('clientsRoot'), 'client');
      req.app.set('appRootPath', root);
    }

    req.app.set('views', [
      req.app.get('appRootPath')
    ]);
  }

  req.wwwConfig = configData;

  next();
}
/**
 *
 * @param req
 * @param res
 * @param next
 */
export function languageMiddleware(req, res, next) {
  // set locale either from cookie or config
  req.wwwConfig.language = languageHelper.getCurrentLanguage(req, res);
  next();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function geoIpMiddleware(req, res, next) {
  //var ip = ipaddr.parse(req.ip);
  req.wwwConfig.country = '--';
  var appDir = path.dirname(require.main.filename);
  var dataPath = appDir + '/../data/GeoLite2-Country.mmdb';

  if (req.ip === '::1' || req.ip.indexOf('192') > -1 || !fs.existsSync(dataPath)) {
    req.wwwConfig.country = config.defaultCountryCode;

    // Do something
  } else {
    var lookup = maxmind.open(dataPath, {
      cache: {
        max: 1000, // max items in cache
        maxAge: 1000 * 60 * 60 // life time in milliseconds
      }
    });
    req.wwwConfig.country = lookup.get(req.ip).country.iso_code;
  }

  next();
}

/**
 * Load the website configuration and set it to res.locals to be rendered by EJS
 * @param req
 * @param res
 * @param next
 */
export function loadClientConfigMiddleware(req, res, next) {
  try {

    var isApi = false;
    if (_.has(req.headers, 'x-request-type') && req.headers['x-request-type'] === 'clientApi') {
      isApi = true;
    }

    var wwwConfig = req.wwwConfig;
    //Fetch website config based on hostname
    var webConfig = wwwConfig;

    var currentLang = (!isApi) ? wwwConfig.language : ((req.cookies[`${wwwConfig.ns}.language`]) ? req.cookies[`${wwwConfig.ns}.language`] : 'en');
    var currentCurrency = currencyUtils.getCurrentCurrency(req, res);

    var dir = currentLang == 'en' ? 'ltr' : 'rtl';

    var mainGaFields = webConfig.gaConfig.fields;
    // secondary google analytics tracking
    var secondGaFields = _.clone(mainGaFields);
    // @important don't change name its linked to frontend !!!
    secondGaFields.name = 'base';

    // set default configuration for angular and meta tags
    var configValues = {
      // seo data
      title: wwwConfig.meta && wwwConfig.meta.title ? wwwConfig.meta.title : webConfig.homeTitle[currentLang],
      description: wwwConfig.meta && wwwConfig.meta.description ? wwwConfig.meta.description : webConfig.homeDescription[currentLang],
      keywords: wwwConfig.meta && wwwConfig.meta.keywords ? wwwConfig.meta.keywords : webConfig.homeKeywords[currentLang],
      og_title: webConfig.og['title'][currentLang],
      og_description: webConfig.og['description'][currentLang],
      og_type: webConfig.og['type'],
      og_url: webConfig.og['url'],
      og_image: webConfig.og['image'],
      og_site_name: webConfig.og['site_name'],
      og_locale: webConfig.og['locale'][currentLang],
      twitter_title: webConfig.twitter['title'][currentLang],
      twitter_description: webConfig.twitter['description'][currentLang],
      twitter_url: webConfig.twitter['url'],
      twitter_card: webConfig.twitter['card'],

      // website currency
      currencyCookie: currencyUtils.currencyCookieName(req),
      currency: currentCurrency,
      currencyLabel: webConfig.currencyLabel,
      baseCurrency: webConfig.baseCurrency,
      amexCurrency: webConfig.amexCurrency,
      // todo implement as swap php
      //exchangeRate: JSON.stringify(currencyInfo.getCurrencyData()),

      // language
      language: currentLang,
      // html dir
      dir: dir,
      // language cookie name
      langCookie: languageHelper.langCookieName(req),
      langText: languageHelper.getAvailableLanguages(req).join('|'),
      // language labels with names codes
      // all languages for web
      langLabel: webConfig.langLabel,

      // country from geoip
      country: wwwConfig.country,
      // namespace for cookies / locale storage
      ns: webConfig.ns,
      // env
      env: config.env,
      social: webConfig.social,
      // stylesheets incase of different ones for websites
      // device info
      device: wwwConfig.device,
      // load moment locale based on current language
      momentLocale: webConfig.momentLocale[currentLang],

      //ga config
      gaTrackerId: webConfig.gaConfig.tracker,
      gaFields: JSON.stringify(mainGaFields),

      secondGaTrackerId: webConfig.gaConfig.secondTracker,
      secondGaFields: JSON.stringify(secondGaFields),

      //gtm config
      gtmTop: webConfig.gtmTop,

      //cms content country to load cms content from
      cmsCountry: webConfig.cmsCountry,

      //the domain which initiating the request
      domain: req.xEnvID,

      // for rendering static cms pages
      cmsContent: webConfig.cmsContent || '',

      // to tell client either client need to render cms page or server already rendered it
      cmsLoaded: _.result(webConfig, 'cmsLoaded', false),

      // for injecting google meta tag for cms pages
      cmsGoogleMeta: wwwConfig.meta && wwwConfig.meta.googleMeta ? wwwConfig.meta.googleMeta : '',

      // translations to embed in EJS
      translation: wwwConfig.translation || JSON.stringify({}),

      hostname: req.hostname,

      url: req.url
    };

    res.locals = configValues;
    res.apiWwwConfig = {
      wwwConfig,
      configValues
    };
    next();

  } catch (e) {
    winston.log('error', 'Error.. while rendering from server', {
      err: e.message,
      stack: e.stack
    });

    next(e);
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function cmsMiddleware(req, res, next) {
  try {
    var path = req.path ? req.path.split('/') : [];
    // for cms page meta data rendering
    if (path.length >= 3 && path[2].length > 0) {
      cmsUtils.getCmsPage(req, config, function (err, result) {
        if (err || !result) {
          return next();
        }

        req.wwwConfig.meta = result.meta && result.meta.title !== '404' ? result.meta : {};
        req.wwwConfig.cmsContent = result.html ? result.html : '';
        //   minify(_.replace(result.html, '</script>', '&lt;/script>'), {
        //   // Prevents the escaping of the values of attributes
        //   preventAttributesEscaping: true,
        //   // Keep the trailing slash on singleton elements
        //   keepClosingSlash: true,
        //   // Minify CSS in style elements and style attributes
        //   minifyCSS: true,
        //   // Minify URLs in various attributes
        //   minifyURLs: true,
        //   // Collapse whitespaces
        //   collapseWhitespace: true,
        //   // Dose not remove whitespace completely always keep one
        //   conservativeCollapse: true
        // }) : '';
        req.wwwConfig.cmsLoaded = result.meta && result.meta.title !== '404';
        next();
      });
    }
    else {
      next();
    }
  }
  catch (e) {
    winston.log('error', 'Error.. while rendering from server', {
      err: e.message,
      stack: e.stack
    });
    next();
  }
}

export function loadTranslation(req, res, next) {
  req.wwwConfig.translation = JSON.stringify({});

  if (req.wwwConfig.language === 'ar') {
    languageHelper.getTranslation(req, 'ar', (err, data) => {
      if (err) {
        return next(err)
      }
      req.wwwConfig.translation = JSON.stringify(data);
      next();
    });
  } else {
    next();
  }
}
