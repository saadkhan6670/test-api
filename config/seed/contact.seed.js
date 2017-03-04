'use strict';

var User = require('../../api/v1/user/user.model');
var Contact = require('../../api/v1/contact/contact.model');

Contact.find({}).remove(() => {

  var contactedUser = new User({
    provider: 'local',
    email: 'contacted@user.com',
    password: 'contacted',
    Title: 'Mr',
    FirstName: 'Contact',
    LastName: 'Touch',
    Gender: 'M'
  });

  contactedUser.save()
    .then((user) => {
      addContactsToUser(user);
      return null;
    })
    .catch(function (err) {
      console.log('error:', err);
    });

});

function addContactsToUser(user) {
  var contact1 = new Contact({
    userId: user._id,
    "Title" : "Mr",
    "FirstName": "John",
    "LastName": "Mair",
    "Phone": "+9715623232323",
    "Email": user.email
  });

  var contact2 = new Contact({
    userId: user._id,
    "Title" : "Ms",
    "FirstName": "John's",
    "LastName": "Secretary",
    "Phone": "+9715623231244",
    "Email": "mail@company.com"
  });


  //TODO: BUG -> Saving concurrently deactivates all contacts
  contact1.save(function() {
    contact2.save();
  })
}

module.exports = addContactsToUser;
