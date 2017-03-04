import deasync from 'deasync';
import cacheManager from 'cache-manager';
import _ from 'lodash';
import ms from 'ms';
import config from '../../config/environment';

const defaultCacheStore = getCache(config.cacheStore);

export function getCache(cacheStore = 'memory') {
  let conf = null;
  const ttl = ms(config.cacheTTL) / 1000;


  switch (cacheStore) {
    case 'redis':
      conf = _.assignIn({}, {
        store: require('cache-manager-redis'),
        ttl
      }, config.redis);
      break;
    case 'mongodb':
      conf = {
        store: require('cache-manager-mongodb'),
        uri : config.mongo.uri,
        options : _.assignIn({}, {
          collection: 'www_cache'
        }, config.mongo.options),
        ttl
      };
      break;
    case 'memory':
    default:
      conf = {
        store: 'memory',
        max: 100,
        ttl
      };
      break;
  }

  const cache = cacheManager.caching(conf);
  return _.assignIn(cache, {
    getSync: deasync(cache.get)
  });
}

export default defaultCacheStore;
