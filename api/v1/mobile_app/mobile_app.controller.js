'use strict';

import MobileAppCallback from './mobile_app.model.js';
import requestUtils from '../../../utils/req.utils';
import _ from 'lodash';
import winston from 'winston';

/*
 Logger for mobile apps to log all the incoming requests
 */
module.exports = {
  create: (req, res) => {
    if(!_.isEmpty(req.body)){
      insertRequestToDatabase(req);
    }
    res.sendStatus(200);
  },

  get: (req, res) => {
    if(!_.isEmpty(req.query)){
      insertRequestToDatabase(req);
    }
    res.sendStatus(200);
  },

  update: (req, res) => {
    if(!_.isEmpty(req.body)){
      insertRequestToDatabase(req);
    }
    res.sendStatus(200);
  },

  delete: (req, res) => {
    if(!_.isEmpty(req.body)){
      insertRequestToDatabase(req);
    }
    res.sendStatus(200);
  }
};

function insertRequestToDatabase(req) {
  var newMobileAppCallback = new MobileAppCallback({
    req: requestUtils.filterObject(req)
  });
  newMobileAppCallback.save()
    .then((savedTajawalAppLog) => {
    })
    .catch((err) => {
      winston.log('error', 'While saving mobile app callback', {
        err: err.message,
        stack: err.stack
      });
    })
}
