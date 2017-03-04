'use strict';

import _ from 'lodash';
import nodeUrl from 'url';
import request from 'request';
import { getCache } from '../components/cache';

const cache = getCache('memory');

module.exports = {

  langCookieText: 'language',

  /**
   *
   * @param req
   * @returns {string}
     */
  langCookieName: function(req) {
    return req.wwwConfig.ns + '.' + this.langCookieText;
  },

  /**
   *
   * @param req
   * @param res
     */
  unsetLanguageCookie: function(req, res) {
    res.clearCookie(this.langCookieName(req), {});
  },

  /**
   *
   * @param req
   * @param res
   * @param userLanguage
     */
  setLanguageCookie: function(req, res, userLanguage) {
    if (!res.headersSent) {
      res.cookie(this.langCookieName(req), userLanguage.toLowerCase());
    }
  },

  /**
   *
   * @param req
   * @returns {*}
   */
  getLanguageFromCookie: function(req) {
    var langInCookie = req.cookies[this.langCookieName(req)] || null;

    if (!this.isLanguageAllowed(req, langInCookie)) {
      return null;
    }
    return langInCookie;
  },

  /**
   *
   * @param req
   * @returns {*}
     */
  getLanguageFromUrl: function(req) {
    var url = nodeUrl.parse(req.url).pathname;
    var path = url.split('/');
    var lang = path[1];
    if (!lang || !this.isLanguageAllowed(req, lang)) {
      return null;
    }
    return lang;
  },

  /**
   *
   * @param req
   * @returns {*}
     */
  getLanguageFromQuery: function(req) {
    var params = req.query;
    var queryLanguage = params[this.langCookieText] || null;

    if (!this.isLanguageAllowed(req, queryLanguage)) {
      return null;
    }

    return queryLanguage;
  },

  /**
   *
   * @param req
   * @returns {boolean}
     */
  shouldRedirect: function(req) {
    return true;
  },

  isLanguageAllowed: function(req, lang) {
    if (_.indexOf(req.wwwConfig.allowedLangs, lang) < 0) {
      return false;
    }
    return true;
  },

  /**
   *
   * @param req
   * @returns {boolean}
     */
  msieVersion: function(req) {
    var ua = req.headers['user-agent'];
    var msie = ua.indexOf("MSIE ");
    var v = false;
    // If IE, alert version
    if (msie > 0 || !!ua.match(/Trident.*rv\:11\./)) {
      v = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
    }

    // This condition always return true.
    // if (true || v && v <= 9) {
    //   return true;
    // }
    // return false;

    return true;
  },

  /**
   *
   * @param req
   * @returns {*}
     */
  getAvailableLanguages: function(req) {
    var lang = req.wwwConfig.allowedLangs;
    return lang;
  },

  /**
   *
   * @param req
   * @param toLanguage
   * @returns {string}
     */
  getRedirectUrl: function(req, toLanguage) {
    var url = nodeUrl.parse(req.url).pathname;
    var cleanPath = url
    // replace multi slashes with one
      .replace(/\/+/g, '/')
      // remove last slash
      .replace(/\/$/g, '');
    var path = cleanPath.split('/');
    var pathLen = path.length;

    //var msPrefix = '';
    //
    //if (this.msieVersion()) {
    //  msPrefix = '#!'
    //}
    // path is home page
    if (!path[1] || path[1] == '') {
      return cleanPath + toLanguage + '/';
    }

    // path has valid language already
    //if (pathLen < 2) {
    //  return req.url;
    //}

    // path is any request come without language in url
    var localeInUrl = path[1];
    // localeInUrl is language code or 2 letters only
    if (localeInUrl.length == 2 && pathLen == 2) {
      path.splice(1, 1);
      return '/' + toLanguage + path.join('/') + '/';
    }

    // if path has already language example //en/contactus
    if (this.isLanguageAllowed(req, path[1])) {
      return cleanPath;
    }
    // no 2 letters prepend the language code to the url without multiple slashes
    return '/' + toLanguage + cleanPath;

  },

  /**
   *
   * @param obj
   * @returns {string}
     */
  serialize: function(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  },

  /**
   *
   * @param req
   * @param res
   * @param toUrl
     */
  redirectTo: function(req, res, toUrl) {
    var headers = {};
    if (!res.headersSent) {
      if (req.query) {
        var queryString = this.serialize(req.query);
        if (queryString) {
          toUrl = toUrl + '/?' + queryString;
        }
      }
      headers = {
        'Location': toUrl,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      };
      res.writeHead(302, headers);
    }

    res.end();
  },

  /**
   *
   * @param req
   * @param res
   * @returns {*}
     */
  getCurrentLanguage: function(req, res) {

    // url query always higher priority than anything
    var urlQuery = this.getLanguageFromQuery(req);

    if (urlQuery) {
      this.setLanguageCookie(req, res, urlQuery);
      return urlQuery;
    }

    // url language second higher priority
    var urlLang = this.getLanguageFromUrl(req);
    var redirectUrl = '';
    if (urlLang) {
      this.setLanguageCookie(req, res, urlLang);
      return urlLang;
    }
    // cookie language second
    var cookieLang = this.getLanguageFromCookie(req);
    if (cookieLang) {
      // redirect or not ?
      if (this.shouldRedirect(req)) {

        redirectUrl = this.getRedirectUrl(req, cookieLang);
        this.redirectTo(req, res, redirectUrl);

      } else {
        return cookieLang;
      }
    }
    // if nothing set fallback to default language
    var defaultLang = req.wwwConfig.defaultLanguage;
    redirectUrl = this.getRedirectUrl(req, defaultLang);
    this.redirectTo(req, res, redirectUrl);
  },

  getTranslation: function(req, lang = 'ar', callback = () => {}) {
    let {xEnvID} = req;
    if (xEnvID === 'local') {
      xEnvID = 'devCom';
    }
    const cacheKey = `${xEnvID}-${lang}-translation`;
    const cacheExpiry = 2 * 60; // 2 minutes in seconds

    let translation = cache.getSync(cacheKey);
    if (translation) {
      return callback(null, translation);
    }
    // To Get fresh file every 1 min
    var t = new Date(), mm = t.getMonth() + 1, dd = t.getDate(), h = t.getHours(), m = t.getMinutes();
    var timeStamp = [t.getFullYear(), !mm[1] && '', mm, !dd[1] && '', dd].join('')+h+m;
    request.get({
      url: `http://tjwlcdn.com/translation/web/${xEnvID}/ar.json?v=${timeStamp}`,
      headers: {
        'user-agent': req.headers['user-agent'],
        'cache-control': req.headers['cache-control'],
        'Pragma': 'no-cache'
      }
    }, (err, response, body) => {
      if (err) return callback(err);
      try {
        const data = JSON.parse(body);
        cache.set(cacheKey, data, {ttl: cacheExpiry});
        callback(null, data);
      } catch (e) {
        callback(null, null);
      }
    });
  }
};
