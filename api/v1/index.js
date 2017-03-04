'use strict';

var router = require('express').Router();

router.use(function(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
// router.use('/map', require('./tajawal_worldmap'));

module.exports = router;
});
router.use('/user', require('./user'));
//router.use('/billing', require('./billing'));
// router.use('/traveller', require('./traveller'));
// router.use('/contact', require('./contact'));
// router.use('/booking', require('./booking'));
// router.use('/newsletter', require('./newsletter'));
// router.use('/mobile_app', require('./mobile_app'));
// router.use('/air/', require('./air'));
// router.use('/cancellation/', require('./cancellation'));
// router.use('/system', require('./system'));
