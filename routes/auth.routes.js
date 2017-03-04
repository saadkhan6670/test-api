'use strict';

import express from 'express';
import authComponent from '../components/auth';
import authMw from '../middleware/auth.middleware';

// Passport Configuration
authComponent.local.strategy.setup();

var router = express.Router();

router.use('/local', authComponent.local.routes, authMw.sendLocalAuthRes());
router.use('/social', authComponent.social.routes, authMw.sendSocialAuthRes());

module.exports = router;
