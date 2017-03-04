'use strict';
//TODO: we definetly need to have validation!!!
//TODO: store phone as object dialcode + number

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import validator from '../../../components/validators';
import timestamps from 'mongoose-timestamp';
import sanitizer from 'sanitizer';

var ContactSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
  isActive: {type: Boolean, default: true},

  // Contact data
  Title: {type: String, required: true},
  FirstName: {type: String, required: true},
  LastName: {type: String, required: true},
  phoneNumber: { //@todo rename to Phone once the apps transitioned to this field
    DialCode: {type: String},
    Number: {type: String}
  },
  Email: {type: String, required: true, validate: validator.isEmail('Email should be valid.')},
  requestHeaders: {select: false}
}, {collection: 'www_contacts', toObject: { virtuals: true }, toJSON: { virtuals: true } });

ContactSchema.virtual('Phone')
  .get(function() {
    if (this.phoneNumber.DialCode && this.phoneNumber.Number) {
      return `${this.phoneNumber.DialCode}${this.phoneNumber.Number}`
    }
  });

ContactSchema.pre('save', function (next) {
  this.FirstName = sanitizer.escape(sanitizer.sanitize(this.FirstName));
  this.LastName = sanitizer.escape(sanitizer.sanitize(this.LastName));

  next();
});

ContactSchema.post('save', function (contact) {
  Contact.update({_id: {$not: {$eq: contact._id}}, userId: contact.userId, isActive: true},
    {isActive: false},
    (err, raw) => {
      if (err) console.log(err);
    });
});

ContactSchema.plugin(timestamps);

let Contact = module.exports = mongoose.model('Contact', ContactSchema);
