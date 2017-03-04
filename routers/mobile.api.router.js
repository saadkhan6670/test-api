/**
 * API Backend routes
 */

'use strict';

import config from "../config/environment";
import request from "request";
import winston from "winston";
import {getApiInfo} from "./../components/info/api.info";
import ApiUrl from "./api.url";
import _ from "lodash";
import compose from "composable-middleware";
import jsonwebtoken from "jsonwebtoken";
import eventEmitter from "./../api/v1/booking/booking.events";
import fillGetBookingReqQuery from "../components/booking/booking-query-proxy";
import routerUtils from "./../utils/router.utils";
import reqUtils from "./../utils/req.utils";
import crypto from 'crypto';
import url from 'url';

/**
 *
 * @param app
 * @returns {Function}
 */
module.exports = function (app) {
  var ApiRequest = ApiUrl(app);
  var ApiConfig = getApiInfo('mobile');
  var ApiHeaders = ApiConfig ? ApiConfig.Headers : {};

  return compose(
    // authenticate user and on success add it to req
    function (req, res, next) {
      var jwtAuth = routerUtils.getHeader(req.headers, 'authorization');
      if (!jwtAuth && req.query['x-mtoken']) {
        jwtAuth = req.query['x-mtoken'];
      }
      jwtAuth = jwtAuth.replace('Bearer ', '');

      // invalid token - synchronous
      try {
        //var decoded = jwt.verify(token, 'wrong-secret');
        req.user = jsonwebtoken.verify(jwtAuth, config.secrets.session);
      } catch (err) {
        //ignore json web token error
      }

      next();
    },

    // this will add the req.query params if the path is /air/flight/book/ extracting the required data
    function (req, res, next) {
      req.query = fillGetBookingReqQuery(req);
      next();
    },

    // build the headers
    function (req, res, next) {

      var apiAuth = routerUtils.getHeader(req.headers, 'x-authorization');
      if (!apiAuth && req.query['x-token']) {
        apiAuth = req.query['x-token'];
      }
      var userEmail = _.get(req.user, 'email', '').toLowerCase();

      var extraHeadersObject = {};
      _.assignIn(extraHeadersObject, req.headers);

      // x-app-id from mobile only !!
      ApiHeaders['x-app-id'] = routerUtils.getHeader(req.headers, 'x-app-id');

      extraHeadersObject['X-Router'] = 'mobile';
      extraHeadersObject['CLIENT_IP'] = routerUtils.getHeader(req.headers, 'x-real-ip');
      extraHeadersObject['X-Real-IP'] = routerUtils.getHeader(req.headers, 'x-real-ip');
      extraHeadersObject['X-Forwarded-For'] = routerUtils.getHeader(req.headers, 'x-forwarded-for');
      extraHeadersObject['X-Forwarded-Proto'] = routerUtils.getHeader(req.headers, 'x-forwarded-proto');
      extraHeadersObject['authorization'] = apiAuth;

      extraHeadersObject['user-agent'] = routerUtils.getHeader(req.headers, 'user-agent');
      extraHeadersObject['x-locale'] = routerUtils.getHeader(req.headers, 'x-locale');
      extraHeadersObject['x-currency'] = routerUtils.getHeader(req.headers, 'x-currency');
      extraHeadersObject['x-fp'] = routerUtils.getHeader(req.headers, 'x-fp');
      extraHeadersObject['referer'] = routerUtils.getHeader(req.headers, 'referer');
      extraHeadersObject['x-user-email'] = userEmail;

      var strHash = userEmail + '**' + ApiHeaders['x-app-id'] + '**';
      extraHeadersObject['x-uhash'] = '';
      if (userEmail) {
        extraHeadersObject['x-uhash'] = crypto.createHash('md5').update(strHash).digest("hex");
      }

      var apiUrl = ApiRequest.getMobileRequestUrl(req);
      extraHeadersObject['host'] = _.get(url.parse(apiUrl), 'host');

      var fieldsToOmit = ['cookie', 'connection', 'token'];
      if (!extraHeadersObject['host']) {
        fieldsToOmit.push('host')
      }

      extraHeadersObject = _.omit(extraHeadersObject, fieldsToOmit);

      req.extraHeaders = _.merge(extraHeadersObject, ApiHeaders);
      next();
    },

    function (req, res, next) {

      var apiUrl = ApiRequest.getMobileRequestUrl(req);

      if (request.debug) {
        console.log('API URL Request ' + req.method + ' => ' + apiUrl);
        console.log(req.body);
        console.log(req.query);
        console.log(req.extraHeaders);
      }

      var gzipEnabled = false;
      var acceptEncoding = _.get(req.headers, 'accept-encoding', '');
      if (acceptEncoding.match(/\bgzip\b/)) {
        gzipEnabled = true;
      }
      var isGzip = gzipEnabled;

      var sendGzippedRes = function (response) {
        if (response) {
          res.writeHead(response.statusCode, response.headers);
        }
        // unmodified http.IncomingMessage object
        response.on('data', function (data) {
          res.write(data);
        });
        response.on('end', function () {
          res.end();
        });
        response.on('finish', function () {
          res.end();
        });
      };

      switch (req.method) {
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
          request({
            method: req.method,
            headers: req.extraHeaders,
            uri: apiUrl,
            qs: req.query,
            json: req.body,
            gzip: isGzip
          })
            .on('response', function (response) {
              sendGzippedRes(response);
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
              json: req.body,
              gzip: isGzip
            }
            , function (error, response, body) {
              // /api/air/flight/book callback for sending emails !!!
              if (req.method === 'POST' && (req.url.indexOf('/flight/book') > -1 || req.url.indexOf('/hotel/booking') > -1) && response.statusCode === 200) {
                var data = {};
                // body is the decompressed response body
                _.assignIn(data, body);
                data['locale'] = reqUtils.getLocale(req.headers['x-locale']);
                data['baseUrl'] = reqUtils.getBaseUrl(req);
                data['requestHeaders'] = req.headers;
                data['booking_type'] = 'flight';
                if (req.url.indexOf('/hotel/booking') > -1) {
                  data['booking_type'] = 'hotel';
                  data['email'] = data.contact.email;
                }
                // when the body does not contains the required data
                if (_.isUndefined(data.email)) {
                  winston.log('error', 'Error.. while parsing booking response');
                }
                else {
                  eventEmitter.emit('create_booking', data);
                }
              }
            })
            .on('response', function (response) {
              sendGzippedRes(response);
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
            qs: req.query,
            gzip: isGzip
          })
            .on('response', function (response) {
              sendGzippedRes(response);
            })
            .on('error', function (err) {
              next(err);
            });
      }
    }
  );
};