'use strict';

import express from 'express';
import passport from 'passport';

var router = express.Router();

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({
      message: 'Something went wrong, please try again.'
    });

    req.user = user;
    return next();
  })(req, res, next)
});

router.get('/logout', function (req, res) {
  res.clearCookie('token');
  res.sendStatus(204);
});

module.exports = router;
