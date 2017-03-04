'use strict';

import express from 'express';
import CancellationController from './cancellation.controller.js';

var router = express.Router();

// Authentication middleware
// this is required as actions in the controller will depend on the user.role

//router.use(auth.isAuthenticated());

router.get('/', CancellationController.index);
router.post('/', CancellationController.create);
router.get('/:id', CancellationController.show);
router.put('/:id', CancellationController.update);
router.delete('/:id', CancellationController.destroy);

//TODO: implement HEAD request to get info.. it didn't work properly

module.exports = router;
