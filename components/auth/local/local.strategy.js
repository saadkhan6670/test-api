import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import config from '../../../config/environment';
import User from '../../../api/v1/user/user.model';


exports.setup = function () {
  passport.use(new LocalStrategy(config.local,
    function (email, password, done) {
      User.findOne({
        email: email.toLowerCase()
        //email: email.toLowerCase()
      }, function (err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, {
            message: 'This email is not registered.'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        }
        return done(null, user);
      });
    }
  ));
};
