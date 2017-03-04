'use strict';

import * as utils from './utils.website';

// base config
/**
 *
 * @param req
 * @returns {{homeTitle: ({en, ar}|{en: string, ar: string}), homeDescription: ({en, ar}|{en: string, ar: string}), homeKeywords: ({en, ar}|{en: string, ar: string}), og: ({title, description, type, url, image, site_name, locale}|{title: {en: string, ar: string}, description: {en: string, ar: string}, type: string, url: string, image: string, site_name: string, locale: {en: string, ar: string}}), twitter: ({title, description, url, card}|{title: {en: string, ar: string}, description: {en: string, ar: string}, url: string, card: string}), allowedLangs: *, langLabel, allowedCurrencies: *, currencyLabel, defaultLanguage: string, defaultCurrency: string, rtlCss: string, ltrCss: string, rtlCssBootstrap: string, webFontCss: string, vendorCss: string, momentLocale: ({en, ar}|{en: string, ar: string}), gtmTop: string, gaConfig: {tracker: string, fields: {siteSpeedSampleRate: number, alwaysSendReferrer: boolean, allowLinker: boolean}}, cmsCountry: string}}
 */
export default function config(req) {
  var siteInfo = utils.getSiteInfo(req);
  var data = {
    homeTitle: utils.getTitle(siteInfo, req),
    homeDescription: utils.getDesc(siteInfo, req),
    homeKeywords: utils.getKeywords(siteInfo, req),
    social: JSON.stringify(utils.getSocialLinks(siteInfo)),

    og: utils.getOg(req),
    twitter: utils.getTwitterCard(req),

    allowedLangs: utils.getLanguagesArray(req),
    langLabel: JSON.stringify(utils.getLanguages(req)),

    allowedCurrencies: utils.getCurrenciesArray(req),
    currencyLabel: JSON.stringify(utils.getCurrencies(req)),

    defaultLanguage: 'en',
    defaultCurrency: 'SAR',
    baseCurrency: 'SAR',
    amexCurrency: 'AED',

    momentLocale: utils.getMomentLocale(req),

    gtmTop: 'GTM-N22PHJ',
    gaConfig: {
      tracker: 'UA-69641408-1',

      fields: {
        siteSpeedSampleRate: 50,
        alwaysSendReferrer: true,
        allowLinker: true
      }
    },
    cmsCountry: utils.getCmsCountry(req),
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'web/assets',
    clientDir: 'client'
  };
  return data;
}
