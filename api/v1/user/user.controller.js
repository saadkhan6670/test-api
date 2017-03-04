'use strict';

import User from './user.model.js';

var UserController = {
  /**
   * Creates a new user
   */
  create: function(req, res, next) {
    //create user

    //if error
    //next({statusCode: 400, message: 'bad request'});
    //else
    //res.send("user created")

  },

  update: function(req, res, next){

  }
};

module.exports = UserController;

///**
// * Authentication callback
// */
//exports.authCallback = function (req, res, next) {
//  res.redirect('/');
//};
