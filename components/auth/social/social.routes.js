'use strict';

import express from 'express';
import passport from 'passport';

var router = express.Router();

router
  //social auth based on token
  .get('/:service_name/token', function (req, res, next) {
    passport.authenticate(req.params.service_name, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/');
      }

      req.user = user;
      return next();
    })(req, res, next);
  })

  //social auth based on credentials
  .get('/:service_name', function (req, res, next) {
    passport.authenticate(req.params.service_name, {session: false})(req, res, next);
  })

  //social auth callback based on credentials
  .get('/:service_name/callback', function (req, res, next) {
    passport.authenticate(req.params.service_name, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/');
      }

      req.user = user;
      return next();
    })(req, res, next);
  });

module.exports = router;
