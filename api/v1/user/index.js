'use strict';

import express from 'express';
import UserController from './user.controller';
import authMw from '../../../middleware/auth.middleware';
import resTransformerMw from '../../../middleware/response.transformer.middleware';

var router = express.Router();

// Add response transformer to res object.
// router.use(resTransformerMw);

//router.delete('/:id', auth.hasRole('admin'), UserController.destroy);
router.post('/create', UserController.create);
router.put('/update', UserController.update)
// router.get('/me', authMw.isAuthenticated(), UserController.index);
// router.put('/password', authMw.isAuthenticated(), UserController.changePassword);
// router.put('/:id', authMw.isAuthenticated(), UserController.update);
// router.put('/:id/password', authMw.isAuthenticated(), UserController.changePassword);
// router.get('/:id', authMw.isAuthenticated(), UserController.show);
// router.post('/', UserController.create);
// router.post('/forgot', UserController.forgotPassword);
// router.get('/:token/reset', UserController.verifyResetPassword);
// router.post('/reset', UserController.resetPassword);

module.exports = router;
