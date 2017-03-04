'use strict';
import * as fs from 'fs';
import * as path from 'path';
import cache from "../../../components/cache";
import moment from 'moment';
import { getAppNamespace } from '../../../config/website/utils.website';

const ttl = moment.duration(2, 'h').asMilliseconds(); // 2 hours in ms

function getConf(newsLetterConfPath, cacheKey) {
  let conf = cache.getSync(cacheKey);
  if (!conf) {
    conf = fs.readFileSync(newsLetterConfPath, 'utf8');
    cache.set(cacheKey, conf, {ttl: ttl / 1000});
  }
  return JSON.parse(conf);
}
var NewsLetterConf = {
  get: (req) => {
    const namespace = getAppNamespace(req);
    const newsLetterConfPath = path.resolve(__dirname, `../../../config/newsletter/newsletter.${namespace}.conf.json`);
    const cacheKey = `NewsLetterConf-${namespace}`;
    return getConf(newsLetterConfPath, cacheKey).lists;
  }
};
module.exports = NewsLetterConf;
