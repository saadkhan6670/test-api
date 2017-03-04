import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var PaymentCheckoutcomVerifyCallbackSchema = new Schema({
  req:   Schema.Types.Mixed
}, { collection: 'www_payment_checkoutcom_verify_callbacks' });

module.exports = mongoose.model('www_payment_checkoutcom_verify_callbacks', PaymentCheckoutcomVerifyCallbackSchema);
