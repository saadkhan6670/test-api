'use strict';

// tajawal.ae
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'tjwl',
    defaultLanguage: 'en',
    defaultCurrency: 'AED',
    baseCurrency: 'AED',

    gtmTop: 'GTM-KVD5VT',
    gaConfig: {
      tracker: 'UA-68417297-1',
      secondTracker: 'UA-68417297-3'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webLiveAe/assets'
  }
}
