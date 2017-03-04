'use strict';

import * as utils from './utils.website';

//www-dev.almosafer.com
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req) {
  return {

    ns: 'alm_dev',
    defaultLanguage: 'ar',
    defaultCurrency: 'SAR',
    baseCurrency: 'SAR',

    gtmTop: 'GTM-N22PHJ',
    gaConfig: {
      tracker: 'UA-84991996-1',
      secondTracker: 'UA-84991996-2'
    },
    assetUrl: '//tjwlcdn.com/',
    assetPrefix: 'webDevCom/assets',
    clientDir: 'alm-' + utils.getSubdomain(req)
  }
}
