'use strict';

import express from 'express';

var router = express.Router();
router.use('/checkout/', require('./checkoutcom'));

module.exports = router;
