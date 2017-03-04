'use strict';

var _ = require('lodash');
var User = require('../../api/v1/user/user.model');
var NewsLetter = require('../../api/v1/newsletter/newsletter-conf.model.js');
var NewsLetterSubscription = require('../../api/v1/newsletter/newsletter.model');

var list = NewsLetter.get();

NewsLetterSubscription.remove({}, function(err, data) {
});

var subscribedUser = new User({
  provider: 'local',
  email: 'subscribed@user.com',
  password: 'subscribed',
  Title: 'Mr',
  FirstName: 'Subscribed',
  LastName: 'Person',
  Gender: 'M'
});

subscribedUser.save()
  .then((user) => {
    addNewsLettersToUser(user);
    return null;
  })
  .catch(function(err) {
    console.log('error:', err);
  });

function addNewsLettersToUser(user) {

  _.forEach(list, function(sub) {
    user.subscriptions.push({
      key: sub.key,
      label: sub.label,
      isSubscribed: true,
      frequency: sub.frequency[0].key
    });
  });

  user.save();
}

module.exports = addNewsLettersToUser;
