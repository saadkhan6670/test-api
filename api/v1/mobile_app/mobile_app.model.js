import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var MobileAppCallbackSchema = new Schema({
  req:   Schema.Types.Mixed
}, { collection: 'www_mobile_app_callbacks' });

module.exports = mongoose.model('www_mobile_app_callbacks', MobileAppCallbackSchema);
