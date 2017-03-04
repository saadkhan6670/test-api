'use strict';

// tajawal.sa
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'tjwl',
    defaultLanguage: 'ar',
    defaultCurrency: 'SAR',
    baseCurrency: 'SAR',

    gtmTop: 'GTM-KVD5VT',
    gaConfig: {
      tracker: 'UA-68417297-1',
      secondTracker: 'UA-68417297-2'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webLiveSa/assets'
  }
}
