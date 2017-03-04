'use strict';

var User = require('../../api/v1/user/user.model');

var addTravellersToUser = require('./traveller.seed');
var addContactsToUser = require('./contact.seed');
var addBillingsToUser = require('./billing.seed');
var addNewsLettersToUser = require('./newsletter.seed');

User.find({}).remove(function () {

  User.create({
    provider: 'local',
    email: 'test@test.com',
    password: 'test',

    Title: 'Mr',
    FirstName: 'Test',
    LastName: 'Tester'
  }, function () {
    console.log('finished populating users');
  });

  var fullOptionUser = new User({
    provider: 'local',
    email: 'full@user.com',
    password: 'full',
    Title: 'Mr',
    FirstName: 'Full',
    LastName: 'User'
  });

  fullOptionUser.save()
    .then((user) => {
      addBillingsToUser(user);
      addTravellersToUser(user);
      addContactsToUser(user);
      addNewsLettersToUser(user);

      var fs = require('fs');
      var path = require('path');
      var dataPath = path.resolve(__dirname, './data/multi-city-booking.json');
      var resBody = JSON.parse(fs.readFileSync(dataPath));

      var postBook = require('../../components/booking/post-book');

      postBook(resBody);

      return null;
    })
    .catch(function (err) {
      console.log('error:', err);
    })

});
