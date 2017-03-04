'use strict';

import validate from 'mongoose-validator';

var validators = {

  isEmail: function(message){
    return [
      validate({
        validator: 'isEmail',
        message: message
      })
    ];
  },

  isAlphanumeric: function(message){
    return [
      validate({
        validator: 'matches',
        arguments: /^[a-z0-9 ]+$/i,
        passIfEmpty: true,
        message: message
      })
    ];
  },

  isBeforeCurrentDate: function(message){
    return [
      validate({
        validator: 'isBefore',
        passIfEmpty: true,
        message: message
      })
    ];
  }
};

module.exports = validators;
