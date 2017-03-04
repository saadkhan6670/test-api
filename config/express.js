/**
 * Express configuration
 *
 * @exports app: configured express instance
 */

'use strict';

import express from 'express';
import ejs from 'ejs';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import path from 'path';
import expressWinston from 'express-winston';
import config from './environment';
import {getTransportsInstance} from './winston';
import passport from 'passport';
import {domainDetect} from '../middleware/domaindetect.middleware';
import MainRouter from '../routes';

const app = express();
const env = app.get('env');

// app.disable('x-powered-by');
// app.enable('trust proxy');

/**
 * Setup for production only
 */
// if (env === 'production') {
//   app.use(morgan('combined'));
// }
//
// /**
//  * Setup for deployed dev and live
//  */
// if (env === 'development' || env === 'production') {
//   app.disable('view cache');
//
//   var root = path.resolve(path.join(config.get('clientsRoot')));
//
//   // resolved WWW_EJS_TEMPLATE_PATH path
//   app.set('clientsRoot', root);
//
//   // default client folder
//   app.set('appRootPath', path.join(root, 'client'));
//   app.use(express.static(app.get('appRootPath'), {index: false}));
// }

/**
 * Setup for local dev
 */
if (env === 'local') {
  // app.set('appRootPath', path.join(config.root, '.tmp/serve'));
  // app.use(express.static(path.join(config.root, 'client'), {index: false}));
  app.use(morgan('dev'));
}

/**
 * Setup view engine EJS
 */
// ejs.delimiter = '?'; // faster to type <? ?>
// app.set('views', [
//   app.get('appRootPath'),
//   config.root + '/server/views'
// ]);
//
// app.set('view engine', 'ejs');
// app.engine('ejs', ejs.renderFile);

/**
 * compress all requests
 */
app.use(compression());

/**
 * parse application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

/**
 * parse application/json
 */
app.use(bodyParser.json({limit: '50mb'}));

// TODO check it it's used, and where
app.use(methodOverride());

// TODO check if we need to use signed cookies
app.use(cookieParser());

/**
 * Initialize Passport
 */
// app.use(passport.initialize());

/**
 * detect the domain initiating the request
 */
// app.use(domainDetect);

/**
 * Mount Application routes
 */
app.use(MainRouter);

/**
 * Configure express winston logging
 */
// app.use(expressWinston.errorLogger({
//   transports: getTransportsInstance()
// }));

/**
 * Error handling middleware
 */
app.use(function handleErrors(err, req, res, next) {
  if (env !== 'local') {
    delete err.stack;
  }
  else {
    /* We display the error in local env */
    console.log(err.stack);
  }

  var statusCode = err.output ? err.output.statusCode : 500;
  if (!res.headersSent) {
    res.status(err.status || statusCode).json(err);
  }
});

module.exports = app;
