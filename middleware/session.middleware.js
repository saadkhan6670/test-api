// Persist sessions with mongoStore
// We need to enable sessions for passport twitter because its an oauth 1.0 strategy

import mongoStore from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
import config from '../config/environment';

var mongoSessionStore = mongoStore(session);

export const sessionMiddleware = session({
  secret: config.secrets.session,
  resave: false,
  saveUninitialized: false,
  store: new mongoSessionStore({
    mongooseConnection: mongoose.connection
  })
});
