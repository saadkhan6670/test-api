'use strict';

import * as utils from './utils.website';

// www-dev.tajawal.sa
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'tjwl_dev',
    defaultLanguage: 'ar',
    defaultCurrency: 'SAR',
    baseCurrency: 'SAR',

    gtmTop: 'GTM-N22PHJ',
    gaConfig: {
      tracker: 'UA-69641408-1',
      secondTracker: 'UA-69641408-3'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webDevSa/assets',
    clientDir: utils.getSubdomain(req)
  }
}
