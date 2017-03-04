/**
 * Winston configuration
 */

'use strict';

import winston from 'winston';
import config from './environment';

/**
 * Return the transports configuration for the init function
 * return values will be added using winston.add(transport.type, transport.options)
 * @returns {*[]}
 */
export function getTransports() {
  if (config.env !== 'local') {
    return productionTransports;
  }

  return localTransports;
}

/**
 * Return and Array of instantiated winston transports
 * used by expressWinston.errorLogger
 * @returns {Array<winston.Transport>}
 */
export function getTransportsInstance() {
  return getTransports().map((t) => {
    return new t.type(t.options);
  })
}

/**
 * Transports for non local environments
 * @type {*[]}
 */
const productionTransports = [
  {
    type: winston.transports.File,
    options: {
      level: 'error',
      logstash: true,
      filename: config.logFilePath,
      maxsize: config.logFileSize
    }
  }
];

/**
 * Transport for local dev environment
 * @type {*[]}
 */
const localTransports = [
  {
    type: winston.transports.File,
    options: {
      level: 'error',
      logstash: true,
      filename: config.logFilePath,
      maxsize: config.logFileSize
    }
  }
];

/**
 * Initialize winston singleton
 * used in app.js
 * @return void
 */
export function init() {
  winston.remove(winston.transports.Console);

  getTransports().forEach((t) => {
    winston.add(t.type, t.options);
  });

  winston.setLevels(config.loggingLevels);
}
