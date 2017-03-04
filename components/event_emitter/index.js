"use strict";

import {EventEmitter2} from "eventemitter2";
import winston from "winston";
import request from "request";
import config from "../../config/environment";
import _ from "lodash";

var server = new EventEmitter2({
  newListener: false
});

/**
 * Generic event emitter to create email jobs
 */
server.on('create_email_job', (data) => {
  var username = _.get(config, 'jobManager.username');
  var password = _.get(config, 'jobManager.password');
  var jobUrl = _.get(config, 'jobManager.url');

  var headers = {
    'authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
  };
  var apiUrl = jobUrl + "/api/job";
  var contactName = data.templateData && data.templateData.contact ? data.templateData.contact.FirstName : data.email;

  if (_.isUndefined(contactName)) {
    contactName = _.get(data.templateData.contact, 'firstName', '');
  }

  request({
      method: 'POST',
      headers: headers,
      uri: apiUrl,
      json: {
        jobName: data.jobName,
        jobData: {
          to: contactName + ' <' + data.email + '>',
          locale: data.locale,
          templateData: data.templateData
        }
      }
    },
    (error, response, body) => {
      if (error || response.statusCode != 200) {
        server.emit('error', error);
      }
    });
});

/**
 * Error handler for all the events
 */
server.on('error', (error) => {
  winston.log('error', 'Error.. while creating job', {
    err: error.message,
    stack: error.stack
  });
});


module.exports = server;
