var User = require('../../api/v1/user/user.model');
var Billing = require('../../api/v1/billing/billing.model');

//Remove all billings
Billing.find({}).remove(function () {

  // create a new user and get a reference to it
  var billedUser = new User({
    provider: 'local',
    email: 'billed@user.com',
    password: 'billed',
    Title: 'Mr',
    FirstName: 'Super',
    LastName: 'Billed',
    Gender: 'M'
  });

  billedUser.save()
    .then(function(user){
      addBillingsToUser(user);
      return null;
    })
    .catch(function (err) {
      console.log('error:', err);
    })

});

function addBillingsToUser(user) {
  // create the billing info
  var billing = new Billing({
    userId: user._id,
    isActive: true,
    Title: user.Title,
    FirstName: user.FirstName,
    LastName: user.LastName,
    Phone: '+9715612232323',
    AddressLine1: 'Avengers street',
    AddressLine2: 'next to hulk mall',
    ZIPCode: '101010',
    City: 'Gotham',
    Country: 'US'
  });

  // create the billing info for home
  var billingNew = new Billing({
    userId: user._id,
    isActive: true,
    Title: 'Mrs',
    FirstName: 'Lady',
    LastName: user.LastName,
    Phone: '+97156123123123',
    AddressLine1: 'Zelda beach walk',
    AddressLine2: 'in front of monkeys bar',
    ZIPCode: '0909090',
    City: 'Panama',
    Country: 'AG',
    CompanyName: 'The Avengers',
    TaxId: '99999'
  });

  billing.save(function() {
    billingNew.save();
  });

}

module.exports = addBillingsToUser;
