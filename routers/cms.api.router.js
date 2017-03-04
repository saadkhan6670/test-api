/**
 * CMS Backend routes
 */

'use strict';

import compose from "composable-middleware";
import cache from "../components/cache";
import config from "../config/environment";
import request from "request";
import {getApiInfo} from "./../components/info/api.info";
import ApiUrl from "./api.url";
import _ from "lodash";
import routerUtils from "./../utils/router.utils";
import reqUtils from "./../utils/req.utils";
import crypto from 'crypto';

/**
 *
 * @param app
 */
module.exports = function (app) {
  var ApiRequest = ApiUrl(app);
  var ApiConfig = getApiInfo();
  var ApiHeaders = ApiConfig ? ApiConfig.Headers : {};

  return compose(
    // Cache middleware
    function (req, res, next) {

      if (config.env !== 'production') {
        return next();
      }


      var keyData = req.body;//_.pick(req.body, ['country', 'locale', 'media', 'template']);
      var cacheKey = crypto.createHash('md5').update(req.hostname + '_' + JSON.stringify(keyData)).digest("hex");
      req.cacheKey = cacheKey;

      cache.get(cacheKey, function (err, result) {
        if (err) return next();

        if (result) {
          res.set('Content-Type', 'application/json');
          return res.send(result);
        }

        return next();
      });
    },

    // Build Headers
    function (req, res, next) {
      var extraHeadersObject = {};

      extraHeadersObject['X-Real-IP'] = routerUtils.getHeader(req.headers, 'x-real-ip');
      extraHeadersObject['X-Forwarded-For'] = routerUtils.getHeader(req.headers, 'x-real-ip');
      extraHeadersObject['X-Forwarded-Proto'] = routerUtils.getHeader(req.headers, 'x-forwarded-proto');
      extraHeadersObject['authorization'] = 'Basic ' + new Buffer(config.cms.username + ':' + config.cms.password).toString('base64');
      extraHeadersObject['referer'] = routerUtils.getHeader(req.headers, 'referer');
      extraHeadersObject['user-agent'] = routerUtils.getHeader(req.headers, 'user-agent');
      extraHeadersObject['x-locale'] = routerUtils.getHeader(req.headers, 'x-locale');
      extraHeadersObject['x-currency'] = routerUtils.getHeader(req.headers, 'x-currency');
      extraHeadersObject['x-fp'] = routerUtils.getHeader(req.headers, 'x-fp');

      req.extraHeaders = _.merge(extraHeadersObject, ApiHeaders);
      next();
    },

    function (req, res, next) {
      var apiUrl = ApiRequest.getCMSApiRequestUrl(req);

      if (request.debug) {
        console.log('API URL Request ' + req.method + ' => ' + apiUrl);
        console.log(req.body);
        console.log(req.query);
        console.log(req.extraHeaders);
      }

      req.body['baseURL'] = req.hostname;
      req.query['baseURL'] = req.hostname;
      req.query['cacheKey'] = req.cacheKey;

      switch (req.method) {
        case 'PUT':
          request({
              method: req.method,
              headers: req.extraHeaders,
              uri: apiUrl,
              qs: req.query,
              json: req.body
            },
            function (error, response, body) {
              if (response) {
                res.writeHead(response.statusCode, response.headers);
              }
              if (typeof body === 'undefined') {
                res.end("\n");
              } else {
                res.write(routerUtils.getBody(body));
                res.end();
              }
            })
            .on('error', function (err) {
              next(err);
            });
          break;
        case 'POST':
          request({
              method: req.method,
              headers: req.extraHeaders,
              uri: apiUrl,
              qs: req.query,
              json: req.body
            },
            function (error, response, body) {
              if (error)
                return next(error);

              if (response) {
                res.writeHead(response.statusCode, response.headers);
              }
              if (typeof body === 'undefined') {
                res.end("\n");
              } else {
                var resBody = routerUtils.getBody(body);
                if (config.env === 'production') {
                  cache.set(req.cacheKey, resBody);
                }
                res.write(resBody);
                res.end();
              }
            })
            .on('error', function (err) {
              next(err);
            });
          break;
        case 'HEAD':
        case 'DEL':
        case 'GET':
        default:
          request({
              method: req.method,
              headers: req.extraHeaders,
              uri: apiUrl,
              qs: req.query
            },
            function (error, response, body) {
              if (response) {
                res.writeHead(response.statusCode, response.headers);
              }
              if (typeof body === 'undefined') {
                res.send();
              } else {
                res.write(body);
                res.end();
              }
            })
            .on('error', function (err) {
              next(err);
            });
      }
    }
  );
};
