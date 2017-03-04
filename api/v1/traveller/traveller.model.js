'use strict';

//TODO: we definetly need to have validation!!!

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
import timestamps from 'mongoose-timestamp';
import softDelete from 'node-mongoose-soft-delete';
import sanitizer from 'sanitizer';
import moment from 'moment';

var TravellerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User',  index: true },
  isActive: { type: Boolean, default: true },

  // Traveller data
  Title: {type: String, required: true},
  FirstName: {type: String, required: true},
  MiddleName: {type: String},
  LastName: {type: String, required: true},
  Type: String, // ADT | CH | INF
  IdNumber: String,
  IdExpiryDate: Date,
  IdCountryId: String,
  CountryId: String,
  IdType: String,
  Gender: String,
  BirthDate: {type: Date, required: false},
  requestHeaders: {},
  isDuplicate: { type: Boolean, default: false }
}, { collection: 'www_travellers' });


// Detect type by birthdate if Type is not set
TravellerSchema.pre('save', function(next) {

  if (this.Type) next();
  else {
    var now = new moment();
    var travellerDate = new moment(this.BirthDate);

    var age = now.year() - travellerDate.year();

    if (age < 2) {
      this.Type = 'INF';
    }
    else if (age <= 12) {
      this.Type = 'CH';
    }
    else if (age > 12) {
      this.Type = 'ADT'
    }

    next();
  }
});

// check that traveller is not created twice for the same user
// based on userId:FirstName:LastName
TravellerSchema.pre('save', function (next) {
  this.FirstName = sanitizer.escape(sanitizer.sanitize(this.FirstName));
  this.MiddleName = sanitizer.escape(sanitizer.sanitize(this.MiddleName));
  this.LastName = sanitizer.escape(sanitizer.sanitize(this.LastName));

  if (!this.isNew) return next();

  Traveller.findOne({ userId: new ObjectId(this.userId), FirstName: this.FirstName, LastName: this.LastName }, (err, traveller) => {
    if (traveller) {
      this.isDuplicate = true;
    }
    next();
  });
});

var queries = ['find', 'findOne', 'findOneAndUpdate', 'update', 'count'];

queries.forEach(function(query) {
  TravellerSchema.pre(query, function(next) {
    // Only query documents that do not have the removed flag set to ture.
    // Setting {isDuplicate: true} overrides this and only queries removed documents.

    this.where({
      isDuplicate: {
        '$ne': true
      }
    });

    next();
  });
});

// TravellerSchema.post('save', function (traveller) {
//   Traveller.update({ _id: { $not: { $eq: traveller._id } }, userId: traveller.userId, isActive: true },
//   { isActive: false },
//   (err) => {
//     if (err) console.log(err);
//   });
// });


TravellerSchema.plugin(timestamps);
TravellerSchema.plugin(softDelete);

let Traveller = module.exports = mongoose.model('Traveller', TravellerSchema);
