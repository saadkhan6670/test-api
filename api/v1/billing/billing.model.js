'use strict';

//TODO: we definetly need to have validation!!!

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import timestamps from 'mongoose-timestamp';
import sanitizer from 'sanitizer';

var BillingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User',  index: true },
  isActive: { type: Boolean, default: true },

  // Billing data
  Title: { type: String, required: false },
  FirstName: { type: String, required: false},
  LastName: { type: String, required: false},
  Phone: String,
  Address1: String,
  Address2: String,
  PostalCode: String,
  City: String,
  CountryId: String,
  CompanyName: String,
  CompanyVatNumber: String,
  requestHeaders: {}
}, { collection: 'www_billings' });

BillingSchema.pre('save', function (next) {
  this.FirstName = sanitizer.escape(sanitizer.sanitize(this.FirstName));
  this.LastName = sanitizer.escape(sanitizer.sanitize(this.LastName));

  next();
});

BillingSchema.post('save', function (billing) {
  Billing.update({ _id: { $not: { $eq: billing._id } }, userId: billing.userId, isActive: true },
  { isActive: false },
  (err) => {
    if (err) console.log(err);
  });
});

BillingSchema.plugin(timestamps);

let Billing = module.exports = mongoose.model('Billing', BillingSchema);
