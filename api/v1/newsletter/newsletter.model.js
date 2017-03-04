'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import timestamps from 'mongoose-timestamp';
import validator from '../../../components/validators';
import uniqueValidator from 'mongoose-unique-validator';

var NewsLetterSubscriptionSchema = new Schema({
  name: {type: String},
  email: { type: String, unique: true, required: true, uniqueCaseInsensitive: true, validate: validator.isEmail('Email should be valid.') },
  fingerprint: { type: String, required: false },
  data: Object
}, { collection: 'www_newsletter_subscriptions' });

NewsLetterSubscriptionSchema.plugin(timestamps);
NewsLetterSubscriptionSchema.plugin(uniqueValidator, {message: 'The specified email address is already subscribed.'});
module.exports = mongoose.model('NewsLetterSubscription', NewsLetterSubscriptionSchema);
