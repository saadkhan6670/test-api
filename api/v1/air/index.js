'use strict';

import express from 'express';
import AirController from './air.controller';

var router = express.Router();
router.post('/book', AirController.book);

module.exports = router;
