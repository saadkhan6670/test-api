'use strict';
import * as utils from './utils.website';
// tajawal.com
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'alm',
    defaultLanguage: 'ar',
    defaultCurrency: 'SAR',
    baseCurrency: 'SAR',

    gtmTop: 'GTM-XXXXX',
    gaConfig: {
      tracker: 'UA-85005767-1',
      secondTracker: 'UA-85005767-2'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webLiveCom/assets',
    clientDir: 'alm-client'
  }
}
