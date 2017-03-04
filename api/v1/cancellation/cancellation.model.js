'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import timestamps from 'mongoose-timestamp';

var CancellationSchema = new Schema({

  title: { type: String },
  fullName: { type: String },
  email: { type: String, lowercase: true },
  telephoneNumber: { type: String },
  tjid: { type: String },
  uuid: { type: String },
  refundType: { type: String },
  refundDesc: { type: String, default: 'No Message.' }

},{ collection: 'www_cancellation' });

CancellationSchema.plugin(timestamps);
module.exports = mongoose.model('Cancellation', CancellationSchema);
