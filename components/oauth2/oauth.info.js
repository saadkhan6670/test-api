/**
 *
 * @param req
 * @returns {*}
 */
import cache from "./../cache";
import ms from 'ms';
import {get} from 'lodash';
import {getApiInfo} from './../info/api.info';

const cacheKey = 'OAuthInfoObject';

export function getOAuth2Token(userPrefix) {

  return get(getOAuth2Data(userPrefix), 'access_token', '');
}

// Get API information from direct link
export function getOAuth2Data(userPrefix) {

  if (!userPrefix) {
    userPrefix = '';
  }

  var userCacheKey = cacheKey + userPrefix + '2';
  let OAuthInfo = cache.getSync(userCacheKey);

  if (OAuthInfo != null) {
    // is cached
    return OAuthInfo;
  }

  var ApiInfo = getApiInfo();
  var OAuthURL = `${ApiInfo.ApiUrl}user/auth/token`;
  // get new config
  var userName = str_rot13(Buffer.from(str_rot13(ApiInfo.OUser), 'base64').toString("ascii"));
  var password = str_rot13(Buffer.from(str_rot13(ApiInfo.OPass), 'base64').toString("ascii"));

  OAuthInfo = makeRequest(OAuthURL, ApiInfo.Headers, userPrefix, userName, password);
  return OAuthInfo;
}

function makeRequest(link, headers = {}, userPrefix, userName, password) {

  var syncRequest = require('sync-request');

  var obj = {
    headers: headers,
    json: {
      "username": userPrefix + userName,
      "password": password,
    }
  };
  var res = syncRequest('POST', link, obj);

  const OAuthInfo = JSON.parse(res.getBody('utf8'));
  const ttl = (OAuthInfo.expires_in * 1000) - ms('1h');

  cache.set(cacheKey + userPrefix + '2', OAuthInfo, {ttl: ttl / 1000});
  return OAuthInfo;
}

function str_rot13(str) {
  // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_rot13/
  // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // improved by: Ates Goral (http://magnetiq.com)
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: str_rot13('Kevin van Zonneveld')
  //   returns 1: 'Xriva ina Mbaariryq'
  //   example 2: str_rot13('Xriva ina Mbaariryq')
  //   returns 2: 'Kevin van Zonneveld'
  //   example 3: str_rot13(33)
  //   returns 3: '33'

  return (str + '')
    .replace(/[a-z]/gi, function (s) {
      return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13))
    })
}
