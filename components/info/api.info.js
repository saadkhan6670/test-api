/**
 * @returns {{getApiInfo: getApiInfo}}
 */
import winston from 'winston';
import cache from "./../cache";
import ms from 'ms';
import config from '../../config/environment';
import syncRequest from 'sync-request';

export function getApiInfo(suffix = 'all') {
  const key = `ApiInfoObject-${suffix}`;
  let objectKey = getApiNodeEnvKey(config.apiNodeEnv);
  let ApiInfo = cache.getSync(key);

  if (ApiInfo != null) {
    // is cached
    return ApiInfo[objectKey];
  }

  ApiInfo = makeRequest(config.infoApi.url, suffix, key);
  return ApiInfo[objectKey];
}

function getApiNodeEnvKey(apiNodeEnv) {
  let objectKey = 'production';

  switch (apiNodeEnv) {
    case 'development':
      objectKey = 'dev';
      break;
    case 'production':
      objectKey = 'live';
      break;
    case 'release':
      objectKey = 'release';
      break;
    case 'test':
      objectKey = 'test';
      break;
    case 'local':
      objectKey = 'local';
      break;
    default:
      objectKey = 'live';
  }

  return objectKey;
}

function makeRequest(link, suffix, key) {
  const ttl = ms('1h');
  const maxRetry = 10;
  let retryTime = ms('30s');
  let retryCount = 0;
  let ApiInfo = null;

  try {
    winston.log('debug', 'Request API Info ', link, suffix, key);

    const res = syncRequest('GET', link, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    ApiInfo = JSON.parse(res.getBody('utf8'));
    cache.set(key, ApiInfo, {ttl: ttl / 1000});
  } catch (e) {
    winston.log('error', 'While fetching API Info', {
      err: e.message,
      stack: e.stack
    });
    setTimeout(function() {
      var apiInfo = cache.get(key);
      if (apiInfo == null && retryCount < maxRetry) {
        makeRequest(link, suffix, key);
        retryCount++;
        retryTime = retryTime + (10000 * retryCount);
        winston.log('debug', 'Retrying to fetch API Info.. Retry No: ' + retryCount);
      }
      else {
        winston.log('debug', 'API Info successfully fetched.. Scheduler is exiting');
      }
    }, retryTime);
    ApiInfo = {};
  }

  return ApiInfo;
}
