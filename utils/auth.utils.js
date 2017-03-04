'use strict';

import config from '../config/environment';
import jwt from 'jsonwebtoken';

module.exports = {
  signToken: function (id, role, email) {
    return jwt.sign({
      _id: id,
      role: role,
      email: email
    }, config.secrets.session, {
      expiresIn: config.jwtExpiresIn
    });
  }
};
