'use strict';

import express from 'express';
import BookingController from './booking.controller.js';
import authMw from '../../../middleware/auth.middleware';
import resTransformerMw from '../../../middleware/response.transformer.middleware';

var router = express.Router();

// Authentication middleware
// this is required as actions in the controller will depend on the user.role
router.use(authMw.isAuthenticated());

// Add response transformer to res object.
router.use(resTransformerMw);

router.get('/', BookingController.index);

//TODO: implement HEAD request to get info.. it didn't work properly

module.exports = router;
