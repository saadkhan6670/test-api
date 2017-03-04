var User = require('../../api/v1/user/user.model');
var Traveller = require('../../api/v1/traveller/traveller.model');

Traveller.find({}).remove(() => {

  var userWithTravellers = new User({
    provider: 'local',
    email: 'traveller@user.com',
    password: 'traveller',
    Title: 'Mr',
    FirstName: 'Flying',
    LastName: 'Man',
    Gender: 'M'
  });

  userWithTravellers.save()
    .then((user) => {
      addTravellersToUser(user);
      return null;
    });
});

function addTravellersToUser(user) {
  var travAdult = new Traveller({
    userId: user._id,
    isActive: true,
    Title: user.Title,
    FirstName: user.FirstName,
    LastName: user.LastName,
    IdNumber: 'E091235',
    IdExpiryDate: '2019-12-01',
    IdentityCountryId: 'AE',
    IdType: 'Passport',
    Gender: 'M',
    BirthDate: '1990-10-10'
  });

  var trav2 = new Traveller({
    userId: user._id,
    isActive: true,
    Title: 'Ms',
    FirstName: 'Lady',
    LastName: user.LastName,
    IdNumber: 'E091233',
    IdExpiryDate: '2019-12-01',
    IdentityCountryId: 'AE',
    IdType: 'Passport',
    Gender: 'F',
    BirthDate: '2008-10-20'
  });

  travAdult.save(() => {
    trav2.save();
  });
}

module.exports = addTravellersToUser;
