'use strict';

//localhost
/**
 *
 * @param req
 * @returns {{ns: string, defaultLanguage: string, defaultCurrency: string, gtmTop: string, gaConfig: {tracker: string, secondTracker: string}}}
 */
export default function config(req){
  return {

    // namespace for cookies / localstorage
    ns: 'tjwl_local',
    defaultLanguage: 'en',
    defaultCurrency: 'AED',

    gtmTop: 'GTM-XXXX',
    gaConfig: {
      tracker: 'UA-NNNNNN-1',
      secondTracker: 'UA-NNNNNN-2'
    }
  }
}
