"use strict";

import eventEmitter from '../../../components/event_emitter';
import postBook from '../../../components/booking/post-book';

/**
 * Event for processing booking requests
 */

eventEmitter.on('create_booking', function(body){
  postBook(body);
});

module.exports = eventEmitter;
