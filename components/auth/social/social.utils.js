'use strict';

module.exports = {
  facebookUserCreation: function (req, profile, token, User, callback) {
    try {
      User.findOne({
          $or: [{
            "facebook.id": profile.id
          }, {
            'email': profile.email ? profile.email.toLowerCase() : profile.id.concat('@facebook.com')
          }]
        })
        .then((user) => {
          //if its existing user just update the id and token for that user
          if (user) {
            user.facebook = {
              id: profile.id,
              token: token
            };

            return user.save();
          }
          else {
            //if its a new user create a user with available details
            return new User({
              email: profile.email ? profile.email.toLowerCase() : profile.id.concat('@facebook.com'),
              FirstName: profile.first_name,
              MiddleName: profile.middle_name,
              LastName: profile.last_name,
              Gender: profile.gender,
              isEmailVerificationRequired: false,
              role: 'user',
              provider: 'facebook',
              requestHeaders: req.filteredHeaders,
              facebook: {
                id: profile.id,
                token: token
              }
            }).save();
          }
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
    }
    catch (e) {
      callback(e);
    }
  },

  twitterUserCreation: function (req, token, tokenSecret, profile, User, callback) {
    try {
      User.findOne({"twitter.id": profile.id_str})
        .then((user) => {
          if (user) {
            //if its existing user just update the id and token for that user
            user.twitter = {
              id: profile.id_str,
              token: token,
              tokenSecret: tokenSecret
            };

            return user.save();
          }
          else {
            //if its a new user create a user with available details
            return new User({
              email: profile.id_str.concat('@twitter.com'),
              isEmailVerificationRequired: false,
              role: 'user',
              provider: 'twitter',
              requestHeaders: req.filteredHeaders,
              twitter: {
                id: profile.id_str,
                token: token,
                tokenSecret: tokenSecret
              }
            }).save();
          }
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
    }
    catch (e) {
      callback(e);
    }
  }
};
