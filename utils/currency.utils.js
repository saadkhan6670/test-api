'use strict';

import _ from 'lodash';

module.exports = {

  currencyCookieText: 'currency',

  /**
   *
   * @param req
   * @returns {string}
     */
  currencyCookieName: function(req) {
    return req.wwwConfig.ns + '.' + this.currencyCookieText;
  },

  /**
   *
   * @param req
   * @param res
     */
  unsetCurrencyCookie: function(req, res) {
    res.clearCookie(this.currencyCookieName(req), {});
  },

  /**
   *
   * @param req
   * @param res
   * @param usercurrency
     */
  setCurrencyCookie: function(req, res, usercurrency) {
    if (!res.headersSent) {
      res.cookie(this.currencyCookieName(req), usercurrency.toUpperCase());
    }
  },

  /**
   *
   * @param req
   * @returns {*}
     */
  getCurrencyFromCookie: function(req) {
    var currencyInCookie = req.cookies[this.currencyCookieName(req)] || null;

    if (!this.isCurrencyAllowed(req, currencyInCookie)) {
      return null;
    }
    return currencyInCookie;
  },

  // todo implement ?currency=AED
  /**
   *
   * @param req
   * @returns {*}
     */
  getCurrencyFromQuery: function(req) {
    var params = req.query;
    var queryCurrency = params[this.currencyCookieText] || null;

    if (!this.isCurrencyAllowed(req, queryCurrency)) {
      return null;
    }

    return queryCurrency;
  },

  /**
   *
   * @param req
   * @param currency
   * @returns {boolean}
     */
  isCurrencyAllowed: function(req, currency) {
    if (_.indexOf(req.wwwConfig.allowedCurrencies, currency) < 0) {
      return false;
    }
    return true;
  },

  /**
   *
   * @param req
   * @param res
   * @returns {*}
     */
  getCurrentCurrency: function(req, res) {

    // query currency always higher priority than anything
    var currencyQuery = this.getCurrencyFromQuery(req);
    if (currencyQuery) {
      this.setCurrencyCookie(req, res, currencyQuery);
      return currencyQuery;
    }

    // cookie currency second
    var cookieCurrency = this.getCurrencyFromCookie(req);
    if (cookieCurrency) {
      return cookieCurrency;
    }

    // if nothing set fallback to default currency
    var defaultCurrency = req.wwwConfig.defaultCurrency;

    this.setCurrencyCookie(req, res, defaultCurrency);
    return defaultCurrency;
  }
};
