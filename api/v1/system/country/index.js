import { Router } from 'express';
import { readFileSync } from 'fs';
import languageHelper from '../../../../helpers/language.helper';
import * as homeRouterMiddleware from '../../../../middleware/home.router.middleware';
import cache from '../../../../components/cache';

const cacheKey = 'CountryList';

const router = Router();

function getCountryList(lang = 'en') {
  const cKey = `${cacheKey}-${lang}`;
  const countryList =  cache.getSync(cKey);

  if (!countryList) {
    const _countryList = JSON.parse(readFileSync(`${__dirname}/country-list-${lang}.json`, 'utf8'));
    cache.set(cKey, _countryList);
    return _countryList;
  }
  return countryList;
}

router.use(homeRouterMiddleware.loadWebsiteConfigMiddleware);

router.get('/list', (req, res) => {
  const lang = req.cookies[languageHelper.langCookieName(req)];
  return res.json(getCountryList(lang));
});

module.exports = router;
