'use strict';

import * as utils from './utils.website';

// www-dev.tajawal.ae
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'tjwl_dev',
    defaultLanguage: 'en',
    defaultCurrency: 'AED',
    baseCurrency: 'AED',

    gtmTop: 'GTM-N22PHJ',
    gaConfig: {
      tracker: 'UA-69641408-1',
      secondTracker: 'UA-69641408-4'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webDevAe/assets',
    clientDir: utils.getSubdomain(req)
  }
}
