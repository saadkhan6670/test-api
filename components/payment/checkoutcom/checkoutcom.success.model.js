import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var PaymentCheckoutcomSuccessCallbackSchema = new Schema({
  req:   Schema.Types.Mixed
}, { collection: 'www_payment_checkoutcom_success_callbacks' });

module.exports = mongoose.model('www_payment_checkoutcom_success_callbacks', PaymentCheckoutcomSuccessCallbackSchema);
