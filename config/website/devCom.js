'use strict';

import * as utils from './utils.website';

//www-dev.tajawal.com
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'tjwl_dev',
    defaultLanguage: 'en',
    defaultCurrency: 'SAR',
    baseCurrency: 'SAR',

    gtmTop: 'GTM-N22PHJ',
    gaConfig: {
      tracker: 'UA-69641408-1',
      secondTracker: 'UA-69641408-2'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webDevCom/assets',
    clientDir: utils.getSubdomain(req)
  }
}
