'use strict';

import express from 'express';
import NewsLetterController from './newsletter.controller';

var router = express.Router();

router.get('/', NewsLetterController.index);
router.post('/subscribe', NewsLetterController.subscribe);

module.exports = router;
