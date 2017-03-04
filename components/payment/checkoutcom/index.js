'use strict';
// todo implement ..
import express from 'express';
import PaymentCheckoutcomSuccessCallback from './checkoutcom.success.model';
import PaymentCheckoutcomFailureCallback from './checkoutcom.failure.model';
import PaymentCheckoutcomVerifyCallback from './checkoutcom.verify.model';
import requestUtils from '../../../utils/req.utils';

var router = express.Router();

// 3DS Success
router.get('/success*', function(req, res, next) {
  insertSuccessRequestToDatabase(req);
  res.sendStatus(200);
});

router.post('/success*', function (req, res, next) {
  insertSuccessRequestToDatabase(req, res);
});

router.put('/success*', function (req, res, next) {
  insertSuccessRequestToDatabase(req);
  res.sendStatus(200);
});



// 3DS Fail
router.get('/fail*', function(req, res, next) {
  insertFailureRequestToDatabase(req);
  res.sendStatus(200);
});

router.post('/fail*', function (req, res, next) {
  insertFailureRequestToDatabase(req);
  res.sendStatus(200);
});

router.put('/fail*', function (req, res, next) {
  insertFailureRequestToDatabase(req);
  res.sendStatus(200);
});






// Charge oobject response
router.get('/verify*', function(req, res, next) {
  insertVerificationRequestToDatabase(req);
  res.sendStatus(200);
});

router.post('/verify*', function (req, res, next) {
  insertVerificationRequestToDatabase(req);
  res.sendStatus(200);
});

router.put('/verify*', function (req, res, next) {
  insertVerificationRequestToDatabase(req);
  res.sendStatus(200);
});


function insertSuccessRequestToDatabase(req) {
  var newPaymentCheckoutcomSuccessCallback = new PaymentCheckoutcomSuccessCallback({
    req: requestUtils.filterObject(req)
  });

  newPaymentCheckoutcomSuccessCallback.save()
    .then((obj) => {
    })
    .catch((err) => {
    })
}

function insertFailureRequestToDatabase(req) {
  var newPaymentCheckoutcomFailureCallback = new PaymentCheckoutcomFailureCallback({
    req: requestUtils.filterObject(req)
  });

  newPaymentCheckoutcomFailureCallback.save()
    .then((obj) => {
    })
    .catch((err) => {
    })
}

function insertVerificationRequestToDatabase(req) {
  var newPaymentCheckoutcomVerifyCallback = new PaymentCheckoutcomVerifyCallback({
    req: requestUtils.filterObject(req)
  });

  newPaymentCheckoutcomVerifyCallback.save()
    .then((obj) => {
    })
    .catch((err) => {
    })
}

module.exports = router;
