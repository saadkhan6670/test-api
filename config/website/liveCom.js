'use strict';

// tajawal.com
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'tjwl',
    defaultLanguage: 'en',
    defaultCurrency: 'SAR',
    baseCurrency: 'SAR',

    gtmTop: 'GTM-KVD5VT',
    gaConfig: {
      tracker: 'UA-68417297-1',
      secondTracker: 'UA-68417297-4'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webLiveCom/assets'
  }
}
