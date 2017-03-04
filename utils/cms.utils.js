'use strict';

import cache from '../components/cache';
import _ from 'lodash';
import request from 'request';

/**
 *
 * @param req
 * @param env
 * @param port
 * @returns {string}
 */
function getApiBaseUrl(req, env, port) {
  var baseUrl = '';

  if (env == 'local' || env == 'test') {
    baseUrl = req.protocol + '://' + req.hostname + ":" + port;
  }
  else {
    baseUrl = req.protocol + '://' + req.hostname;
  }

  return baseUrl;
}

/**
 *
 * @param locale
 * @returns {string}
 */
function getLocale(locale) {
  var cmsLocale = 'en_us';
  if (locale == 'ar') {
    cmsLocale = locale.concat('_sa');
  }

  return cmsLocale;
}

/**
 *
 * @param path
 * @returns {string}
 */
function getTemplateName(path) {
  var templateName = '';
  switch (path) {
    case 'booking-policy':
      templateName = 'flight-booking-policy';
      break;
    default:
      templateName = path;
      break;
  }

  return templateName;
}

/**
 *
 * @param key
 * @param data
 */
function setCmsPageCache(key, data) {
  cache.set(key, data);
}

/**
 *
 * @param key
 * @param cb
 */
function getCmsPageCache(key, cb) {
  cache.get(key, function (err, result) {
    if (err) return cb(err);

    cb(null, result);
  });
}

/**
 *
 * @param req
 * @param body
 * @param config
 * @param cb
 */
function requestCmsPage(req, body, config, cb) {
  var ApiUrl = getApiBaseUrl(req, config.env, config.port) + '/api/cms/page';
  request({
      method: 'POST',
      uri: ApiUrl,
      json: body,
      timeout: 2000
    },
    function (error, response, body) {
      if (error || response.statusCode !== 200 || _.isUndefined(body))
        return cb(new Error('Failed to fetch page from cms'));

      return cb(null, body);
    });
}

/**
 *
 * @param req
 * @param config
 * @param cb
 */

export function getCmsPage(req, config, cb) {
  var wwwConfig = req.wwwConfig;

  // prepare a body to request cms page either from cahce or cms
  var template = getTemplateName(_.trimEnd(_.replace(req.path, '/' + wwwConfig.language + '/', ''), '/')) + '.html';
  var language = getLocale(wwwConfig.language);
  var body = {
    country: wwwConfig.cmsCountry,
    media: 'desktop',
    template: template,
    locale: language,
    baseURL: req.hostname
  };

  // create a key to set or get cms page from cache
  var cacheKey = crypto.createHash('md5').update(req.hostname + '_' + JSON.stringify(body)).digest("hex");

  // try to get cms page from cache first
  getCmsPageCache(cacheKey, function (err, result) {
    if (err || !result) {
      // try to request page from cms when it does not exist in cache
      requestCmsPage(req, body, config, function (err, result) {
        if (err) {
          return cb(err);
        }

        // set page in cache and return
        if (config.env === 'production') {
          setCmsPageCache(cacheKey, result);
        }
        cb(null, result);
      })
    }
    else {
      // page found in cache return
      cb(null, result);
    }
  })
}
