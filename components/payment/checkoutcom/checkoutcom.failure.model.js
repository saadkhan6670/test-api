import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var PaymentCheckoutcomFailureCallbackSchema = new Schema({
  req:   Schema.Types.Mixed
}, { collection: 'www_payment_checkoutcom_failure_callbacks' });

module.exports = mongoose.model('www_payment_checkoutcom_failure_callbacks', PaymentCheckoutcomFailureCallbackSchema);
