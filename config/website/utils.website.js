'use strict';

import _ from "lodash";
import local from "./local";
import devCom from "./devCom";
import liveCom from "./liveCom";
import liveAe from "./liveAe";
import devAe from "./devAe";
import devSa from "./devSa";
import liveSa from "./liveSa";
import devMoCom from "./devMoCom";
import liveMoCom from "./liveMoCom";

// localhost, 192.168.*.*, 127.0.0.1,...

// www.tajawal.com

// www.tajawal.ae
// www.tajawal.sa

// www.almosafer.com

/**
 *
 * @param req
 * @returns {*[]}
 */
export function getCurrencies(req) {
  return [{
    'code': 'SAR',
    'symbol': 'SAR',
    'name': "Saudi Riyal"
  }, {
    'code': 'AED',
    'symbol': 'AED',
    'name': "United Arab Emirates Dirham"
  }, {
    'code': 'QAR',
    'symbol': 'QAR',
    'name': "Qatari Rial"
  }, {
    'code': 'KWD',
    'symbol': 'KWD',
    'name': "Kuwaiti Dinar"
  }, {
    'code': 'BHD',
    'symbol': 'BD',
    'name': "Bahraini Dinar"
  }, {
    'code': 'USD',
    'symbol': '$',
    'name': "US Dollar"
  }, {
    'code': 'EUR',
    'symbol': '€',
    'name': "Euro"
  }, {
    'code': 'GBP',
    'symbol': '£',
    'name': "British Pound"
  }];
}

/**
 *
 * @param req
 * @returns {*}
 */
export function getCurrenciesArray(req) {
  return getCurrencies(req).map(function (currency) {
    return currency.code;
  });
  // all sites has all currencies
  //var site = getSiteInfo(req);
  //// based on backend configurations
  //// @todo move to .env
  //switch (site.xSiteId) {
  //  case 'tajawal.ae' :
  //  //return ['AED'];
  //  case 'tajawal.sa' :
  //  //return ['SAR'];
  //
  //  default:
  //    return getCurrencies(req).map(function(currency) {
  //      return currency.code;
  //    });
  //
  //}
}

/**
 *
 * @param req
 * @returns {*[]}
 */
export function getLanguages(req) {
  return [{
    name: 'English',
    value: 'en'
  }, {
    name: 'عربي',
    value: 'ar'
  }];
}

/**
 *
 * @param req
 * @returns {*}
 */
export function getLanguagesArray(req) {
  return getLanguages(req).map(function (lang) {
    return lang.value;
  });
}

/**
 *
 * @param siteInfo
 * @returns {{facebook: string, twitter: string}}
 */
export function getSocialLinks(siteInfo) {
  //all sites has all currencies
  switch (siteInfo.xSiteId) {
    case 'tajawal.ae' :
      return {
        facebook: 'tajawaluae',
        twitter: 'tajawalae'
      };
    case 'tajawal.sa' :
      return {
        facebook: 'tajawalksa',
        twitter: 'tajawalsa'
      };
    case 'almosafer.net' :
    case 'almosafer.com' :
      return {
        facebook: 'Almosafertravel',
        twitter: 'almosafertravel'
      };
    default:
      return {
        facebook: 'tajawal',
        twitter: 'tajawal'
      };
  }
}

/**
 *
 * @param siteInfo
 * @param req
 * @returns {{en: string, ar: string}}
 */
export function getTitle(siteInfo, req) {
  if (_.includes(req.url, '/hotels')) {
    switch (siteInfo.xSiteId) {
      case 'tajawal.ae' :
        return {
          en: 'tajawal | Hotel Booking - Cheap Hotels & Resorts Reservation',
          ar: 'تجول | حجز فنادق - ارخص حجوزات الفنادق والمنتجعات'
        };
      case 'tajawal.sa' :
        return {
          en: 'tajawal | Hotel Booking - Online Hotel Reservation',
          ar: 'تجول | حجز فنادق - اسعار الفنادق والمنتجعات'
        };
      case 'almosafer.net' :
      case 'almosafer.com' :
        return {
          en: 'Almosafer | Online Hotel Booking - Hotel Search & Reservation',
          ar: 'المسافر | حجز فنادق - افضل وارخص الفنادق بالشرق الأوسط'
        };

      default:
        return {
          en: 'tajawal | Online Hotel Booking - Hotel Search & Reservation',
          ar: 'تجول | حجز فنادق - افضل وارخص الفنادق بالشرق الأوسط'

        };
    }
  }
  //all sites has all currencies
  switch (siteInfo.xSiteId) {
    case 'tajawal.ae' :
      return {
        en: 'tajawal | Booking Flights, Cheap Airline Tickets & Airfare',
        ar: 'تجول | حجز طيران، رحلات بافضل اسعار تذاكر طيران بالامارات والشرق الأوسط'
      };
    case 'tajawal.sa' :
      return {
        en: 'tajawal | Cheap Flight Booking, Airline Tickets & Trips',
        ar: 'تجول | حجز طيران، عروض رحلات وتذاكر طيران في السعودية والشرق الأوسط'
      };

    case 'almosafer.net' :
    case 'almosafer.com' :
      return {
        en: 'Almosafer | Online Hotel Booking - Hotel Search & Reservation',
        ar: 'المسافر | حجز فنادق - افضل وارخص الفنادق بالشرق الأوسط'
      };
    default:
      return {
        en: 'tajawal | Online Booking for Cheap Flights & Airline Tickets',
        ar: 'تجول | حجز تذاكر طيران وعروض ارخص رحلات الطيران بالشرق الأوسط'
      };
  }
}

/**
 *
 * @param siteInfo
 * @param req
 * @returns {{en: string, ar: string}}
 */
export function getDesc(siteInfo, req) {
  if (_.includes(req.url, '/hotels')) {
    switch (siteInfo.xSiteId) {
      case 'tajawal.ae' :
        return {
          en: 'Get the best prices online at tajawal.ae for hotel booking. Search from a great variety of hotels and resorts and get the best hotel reservation process with tajawal',
          ar: ' موقع تجول يوفر خدمة حجز فنادق ومنتجعات بافضل الاسعار اون لاين. تمتع بالاختيار من بين افخم وارخص الفنادق حول العالم واحجزاقامتك الأن'
        };
      case 'tajawal.sa' :
        return {
          en: 'tajawal.sa offers Hotel bookings with the best prices online in the middle east. Search hotels and choose from a wide variety of great hotels & resorts around the world',
          ar: 'حجز فنادق ومنتجعات بافضل الاسعار اون لاين عبر موقع تجول. اختار من بين ارخص وافخم الفنادق حول العالم واحجزالفندق المفضل لديك الأن'
        };
      case 'almosafer.net' :
      case 'almosafer.com' :
        return {
          en: 'Almosafer | Online Hotel Booking - Hotel Search & Reservation',
          ar: 'المسافر | حجز فنادق - افضل وارخص الفنادق بالشرق الأوسط'
        };
      default:
        return {
          en: 'Hotel booking with the best prices online through tajawal. Hotel search and reservation from a wide variety of hotels all over the world',
          ar: 'حجز فنادق بارخص الاسعار اون لاين عبر موقع تجول. يمكنك الأن الاختيارمن بين أفضل مجموعة فنادق ومنتجعات حول العالم'
        };
    }

  }
  switch (siteInfo.xSiteId) {
    case 'tajawal.ae' :
      return {
        en: 'Booking flights, airline tickets in UAE & the Middle East, prepare your vacation well & get cheap flight tickets at its best airfare on tajawal.ae',
        ar: 'حجز طيران بافضل اسعار تذاكر الطيران في الامارات والشرق الأوسط لدى موقع تجول، تمتع بتخطيط رحلات طيران مميزة من بين افضل الخطوط الجوية المحلية والعالمية'
      };
    case 'tajawal.sa' :
      return {
        en: 'Cheap flight booking, airline tickets in Saudi Arabia & the Middle East, Plan your trip & get cheap flight tickets at its best airfare on tajawal.sa',
        ar: 'حجز طيران وعروض رحلات مع تجول أسهل موقع حجز طيران في السعودية والشرق الأوسط، تمتع بخدمة حجز تذاكر طيران مميزة من بين افضل الخطوط الجوية المحلية والعالمية'
      };
    case 'almosafer.net' :
    case 'almosafer.com' :
      return {
        en: 'Almosafer | Online Hotel Booking - Hotel Search & Reservation',
        ar: 'المسافر | حجز فنادق - افضل وارخص الفنادق بالشرق الأوسط'
      };
    default:
      return {
        en: 'booking cheap flights & airline tickets, Plan your next unforgettable trip & get cheap flight tickets at its best airfare on tajawal.com',
        ar: 'حجز تذاكر طيران ولا اسهل مع تجول ارخص طيران وعروض سفر بالشرق الأوسط، تمتع بخدمة حجز طيران مميزة من بين افضل الخطوط الجوية المحلية والعالمية'
      };
  }

}
/**
 *
 * @param siteInfo
 * @param req
 * @returns {{en: string, ar: string}}
 */
export function getKeywords(siteInfo, req) {
  if (_.includes(req.url, '/hotels')) {
    switch (siteInfo.xSiteId) {
      case 'tajawal.ae' :
        return {
          en: 'hotels, hotel, cheap hotels, hotel booking, online hotel booking, hotel reservation, hotel search, booking hotel, resort',
          ar: 'فنادق, حجز فنادق, فندق, حجوزات فنادق, حجز فندق, موقع حجز فنادق, ارخص فنادق, منتجعات'
        };
      case 'tajawal.sa' :
        return {
          en: 'hotels, hotel, cheap hotels, hotel booking, online hotel booking, hotel reservation, hotel search, booking hotel, resort',
          ar: 'فنادق, حجز فنادق, فندق, حجوزات فنادق, حجز فندق, موقع حجز فنادق, ارخص فنادق, منتجعات'
        };
      case 'almosafer.net' :
      case 'almosafer.com' :
        return {
          en: 'Almosafer | Online Hotel Booking - Hotel Search & Reservation',
          ar: 'المسافر | حجز فنادق - افضل وارخص الفنادق بالشرق الأوسط'
        };
      default:
        return {
          en: 'hotels, hotel, cheap hotels, hotel booking, online hotel booking, hotel reservation, hotel search, booking hotel, resort',
          ar: 'فنادق, حجز فنادق, فندق, حجوزات فنادق, حجز فندق, موقع حجز فنادق, ارخص فنادق, منتجعات'
        };

    }

  }
  //all sites has all currencies
  switch (siteInfo.xSiteId) {
    case 'tajawal.ae' :
      return {
        en: 'booking flights, cheap airline tickets, airline tickets, airfare, flight deals, airfare deals, flight booking, flight search, cheap travel, flight booking, cheapest flights, flight, air ticket booking, cheap airfares',
        ar: 'رحلات, حجز طيران, تذاكر طيران, تذاكر طيران رخيصة, طيران رخيص, رحلات طيران, حجز الطيران, الخطوط الجوية, حجوزات طيران, خطوط الطيران, اسعار تذاكر طيران, عروض رحلات'
      };
    case 'tajawal.sa' :
      return {
        en: 'booking flights, cheap flight, airfares, cheap airline tickets, airline tickets, airfare, flight deals, airfare deals, flight booking, flight search, cheap travel, flight booking, cheapest flights, flight, air ticket booking, cheap airfares',
        ar: 'حجز طيران, تذاكر طيران, تذاكر طيران رخيصة, طيران رخيص, رحلات طيران, حجز الطيران, الخطوط الجوية, حجوزات طيران, خطوط الطيران, اسعار تذاكر الطيران, عروض رحلات'
      };
    case 'almosafer.net' :
    case 'almosafer.com' :
      return {
        en: 'Almosafer | Online Hotel Booking - Hotel Search & Reservation',
        ar: 'المسافر | حجز فنادق - افضل وارخص الفنادق بالشرق الأوسط'
      };
    default:
      return {
        en: 'booking flights, cheap flights, cheap airfares, cheap airline tickets, airline tickets, airfare, flight deals, airfare deals, flight booking, flight search, cheap travel, flight booking, cheapest flights, flight, air ticket booking',
        ar: 'حجز طيران, تذاكر طيران, تذاكر طيران رخيصة, طيران رخيص, رحلات طيران, حجز الطيران, الخطوط الجوية, حجوزات طيران, خطوط الطيران, ارخص تذاكر طيران, اسعار تذاكر الطيران, عروض تذاكر الطيران '
      };

  }
}

/**
 *
 * @param req
 * @returns {{title: {en: string, ar: string}, description: {en: string, ar: string}, type: string, url: string, image: string, site_name: string, locale: {en: string, ar: string}}}
 */
export function getOg(req) {
  return {
    title: {
      en: 'title',
      ar: 'title'
    },
    description: {
      en: 'description',
      ar: 'description'
    },
    type: 'type',
    url: 'url',
    image: 'image',
    site_name: 'stie_name',
    locale: {
      en: 'en_US',
      ar: 'ar_SA'
    }
  };
}

/**
 *
 * @param req
 * @returns {{title: {en: string, ar: string}, description: {en: string, ar: string}, url: string, card: string}}
 */
export function getTwitterCard(req) {
  return {
    title: {
      en: 'title',
      ar: 'title'
    },
    description: {
      en: 'description',
      ar: 'description'
    },
    url: 'url',
    card: 'card'
  };
}
/**
 *
 * @returns {{en: string, ar: string}}
 */
export function getMomentLocale(req) {
  return {
    en: '',
    ar: '/assets/locale/amLocale-ar-sa.js'
  };
}

/**
 *
 * @param req
 * @returns {string}
 */
export function getCmsCountry(req) {
  // devCom, wwwCom is general
  var country = 'general';

  switch (req.xEnvID) {
    case 'devAe':
    case 'liveAe':
      country = 'uae';
      break;
    case 'devSa':
    case 'liveSa':
      country = 'ksa';
      break;
    case 'devMoNet':
    case 'devMoCom':
    case 'liveMoNet':
    case 'liveMoCom':
      country = 'ksa';
      break;
    default:
      country = 'general';
      break;
  }

  return country;
}

/**
 *
 * @returns {{domains: {local: string[], devCom: string[], devSa: string[], liveCom: string[], liveAe: string[], liveSa: string[]}}}
 */
export function getDomainList() {
  return {
    domains: {
      //local: ['localhost', '127.0.0.1', '192.168.1.*', '10.0.0.*'],
      // dev
      devCom: ['www.*dev.*tajawal.com', 'www.*dev.*tajawal.local'],
      devSa: ['www.*dev.*tajawal.sa'],
      devAe: ['www.*dev.*tajawal.ae'],
      devMoCom: ['www.*dev.*almosafer.local', 'www.*dev.*almosafer.com'],
      devMoNet: ['www.*dev.*almosafer.net'],

      liveMoCom: ['almosafer.com','www.almosafer.com'],
      liveMoNet: ['almosafer.net','www.almosafer.net'],

      // live
      liveCom: ['tajawal.com', 'www.tajawal.com'],
      liveSa: ['tajawal.sa', 'www.tajawal.sa'],
      liveAe: ['tajawal.ae', 'www.tajawal.ae'],
    }
  };
}

export function getSubdomain(req) {
  let hostname = req.hostname;
  var parts = hostname.split('.');

  return parts && parts.length > 0 ? parts[0] : 'client';
}

/**
 *
 * @param req
 * @returns {string|undefined}
 */
export function getDomainEnv(req) {

  let hostname = req.hostname;
  const {domains} = getDomainList();
  let env = null;

  _.map(domains, (envs, index) => {
    _.map(envs, (domainEnv) => {
      const domainTest = new RegExp(domainEnv);
      if (_.result(domainTest.exec(hostname), 'length', false) && !env) env = index;
    });
  });

  return (env) ? env : 'liveCom';
}

export function getAppNamespace(req) {
  let xEnvID = req.xEnvID;
  return xEnvID === 'devMoCom' || xEnvID === 'liveMoCom' ? 'almosafer' : 'tajawal';
}

/**
 *
 * @param req
 * @returns {{xSiteId: string, userPrefix: string, xAppId: number}}
 */
export function getSiteInfo(req) {
  var envDomain = getDomainEnv(req);
  // used for cache oauth tokens
  var userPrefix = '';
  // used for order tracking
  var xAppId = 1;
  // use for configuration in api
  var xSiteId = 'tajawal.com';

  switch (envDomain) {
    case 'devAe':
    case 'liveAe':
      xSiteId = 'tajawal.ae';
      userPrefix = 'ae_';
      xAppId = 4;
      break;
    case 'devSa':
    case 'liveSa':
      xSiteId = 'tajawal.sa';
      userPrefix = 'sa_';
      xAppId = 5;
      break;
    case 'devMoCom':
    case 'liveMoCom':
      xSiteId = 'almosafer.com';
      userPrefix = 'alm_com_';
      xAppId = 50;
      break;
    case 'devMoNet':
    case 'liveMoNet':
      xSiteId = 'almosafer.net';
      userPrefix = 'alm_net_';
      xAppId = 51;
      break;
    case 'local':
      xSiteId = 'local';
      break;
  }

  return {
    xSiteId: xSiteId,
    userPrefix: userPrefix,
    xAppId: xAppId
  };
}

/**
 *
 * @param req
 * @returns {{}}
 */
export function getDomainConfig(req) {
  var config = {};
  var xEnvID = req.xEnvID;

  switch (xEnvID) {
    //
    case 'devCom':
      config = devCom(req);
      break;
    case 'liveCom':
      config = liveCom(req);
      break;

    //
    case 'devAe':
      config = devAe(req);
      break;
    case 'liveAe':
      config = liveAe(req);
      break;

    //
    case 'devSa':
      config = devSa(req);
      break;
    case 'liveSa':
      config = liveSa(req);
      break;
    //
    case 'devMoCom':
      config = devMoCom(req);
      break;
    case 'liveMoCom':
      config = liveMoCom(req);
      break;

    // local
    case 'local':
      config = local(req);
      break;

    //
    default:
      config = devCom(req);
      break;
  }

  return config;
}
