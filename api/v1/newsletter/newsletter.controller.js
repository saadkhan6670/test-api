'use strict';

import NewsLetterConf from './newsletter-conf.model.js';
import NewsLetterSubscription from './newsletter.model.js';
import Boom from 'boom';
import eventEmitter from '../../../components/event_emitter';
import _ from 'lodash';
import reqUtils from '../../../utils/req.utils';

var NewsLetterController = {
  index: function(req, res, next) {
    return res.json(NewsLetterConf.get(req));
  },
  subscribe: function(req, res, next) {
    var email = req.body.email.toLowerCase();
    var name = req.body.name;
    NewsLetterSubscription.findOne().where({email: email}).exec(function(err, subscriber) {
      if (subscriber) {
        var error = Boom.badData("The specified email address is already subscribed.", {});
        error['errors'] = {};
        error['errors'] = {email: {message: 'The specified email address is already subscribed'}};

        return next(error);
      }

      var subscriptionData = {
        email: email,
        name: name,
        fingerprint: req.fingerprint,
        data: {
          headers: req.filteredHeaders
        }
      };

      var sub = new NewsLetterSubscription(subscriptionData);

      sub.save()
        .then(function() {
          var locale = _.isUndefined(req.headers['x-locale']) ? 'en' : req.headers['x-locale'];
          var jobData = {};
          jobData['jobName'] = 'newsletter_subscription_email';
          jobData['locale'] = locale;
          jobData['email'] = subscriptionData.email;
          jobData['templateData'] = {
            baseURL: reqUtils.getBaseUrl(req)
          };
          eventEmitter.emit('create_email_job', jobData);
          return res.sendStatus(200);
        })
        .catch(function(err) {
          if (err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    });


  }
};

module.exports = NewsLetterController;
