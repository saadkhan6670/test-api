import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import timestamps from 'mongoose-timestamp';
import validator from '../../../components/validators';

var BookingSchema = new Schema({
  userId: String,
  Email: {type: String, validate: validator.isEmail('Email should be valid.')},
  booking_nr: String,
  Uuid: String,
  TripType: String,
  TravellerCount: Number,
  Leg: Object,
  requestHeaders: {}
}, {collection: 'www_bookings'});

BookingSchema.plugin(timestamps);

module.exports = mongoose.model('Booking', BookingSchema);
