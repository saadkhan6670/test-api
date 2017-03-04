'use strict';

import express from 'express';
import MOBILEAPPController from './mobile_app.controller';

var router = express.Router();


//router.delete('/:id', auth.hasRole('admin'), UserController.destroy);
router.get('/callback*', MOBILEAPPController.get);
router.put('/callback*', MOBILEAPPController.update);
router.post('/callback*', MOBILEAPPController.update);

module.exports = router;
