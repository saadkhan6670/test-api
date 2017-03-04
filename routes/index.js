/**
 * Main application routes
 */

'use strict';
import { Router } from 'express';
import passport from 'passport';
import errors from '../components/errors';
import { sessionMiddleware } from '../middleware/session.middleware';
import passportMw from '../middleware/passport.middleware';
import fingerPrintMw from '../middleware/fingerprint.middleware';
import headerFilterMw from '../middleware/headerfilter.middleware';

/**
 *
 * @param app
 */

const router = Router();

// Insert routes below

/**
 * Fingerprint and request header filter middleware
 */
// router.all('/api/*', headerFilterMw, fingerPrintMw);

/**
 * /api/v1 routes
 */
router.use('/api/v1', require('../api/v1'));

/**
 * www config route
 */
// router.route('/api/www-config')
//   .get(require('../routers/api.home.router'));
//
// /**
//  * Payment
//  */
// router.use('/payment', require('../components/payment'));
//
// /**
//  * Auth
//  * Initializing passport social strategies dynamically based on domain
//  * twitter OAuth session handling
//  */
// router.use(passportMw);
// router.all('/auth/social/twitter*', sessionMiddleware, passport.session());
// router.use('/auth', headerFilterMw, require('./auth.routes'));
//
// /**
//  * APIS Routers proxies
//  */
// router.all('/api/cms/*', require('../routers/cms.api.router')());
// router.all('/api/m/*', require('../routers/mobile.api.router')());
// router.all('/api/*', require('../routers/web.api.router')());
//
// /**
//  * All undefined asset or api routes should return a 404
//  */
// router.route('/:url(api|auth|components|app|bower_components|assets)/*')
//   .get(errors[404]);
//
// /**
//  * index.ejs router
//  */
// router.route('/*')
//   .get(require('../routers/home.router'));
//

module.exports = router;
