'use strict';

// TODO: we should remove userId from the responses except for the admin role
// TODO: Move all user roles checks in some kind of middleware to prevent duplication always DRY
// TODO: move business logic to model, keep the controller lean, make the model as Schema + business logic, to be reused in different spots
// TODO: better error handling

import compose from 'composable-middleware';
import Billing from './billing.model.js';
import userMiddleware from '../../../middleware/user.middleware';
import validationMiddleware from '../../../middleware/validation.middleware';
import Boom from 'boom';

// TODO: make this controller extend a baseController that will enhance auth middleware
var BillingController = {

  /**
   * Get list of billings
   * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
   */
  index: compose(
    // Step 1 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 2 - get data from the db and send it to client
    function (req, res, next) {
      Billing.find(req.dbQuery)
        .then((billings) => {
          var billingList = [];
          billings.forEach(function (billing) {
            billingList.push(res.transform(billing.toJSON(), {
              removeFields: [
                'requestHeaders',
                'createdAt',
                'updatedAt',
                '__v'
              ],
              medium: 'web'
            }));
          });
          return res.status(200).json(billingList);
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  ),

  /**
   * Creates a new billing
   * restriction: 'user' => by userId added by `addUserIdToBodyPayload` middleware
   */
  create: compose(
    //Step 1 - build the body of the billing (payload)
    userMiddleware.addUserIdToBodyPayload,
    //Step 2 - insert the record to the db and send it to the client
    function (req, res, next) {
      if (req.body['_id']) delete req.body['_id'];
      var newBilling = new Billing(req.body);
      newBilling.requestHeaders = req.filteredHeaders;

      newBilling.save()
        .then((savedBilling) => {
          return res.status(200).json(res.transform(savedBilling.toJSON(), {
            removeFields: [
              'requestHeaders',
              'createdAt',
              'updatedAt',
              '__v'
            ],
            medium: 'web'
          }));
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        })
    }
  ),

  /**
   * Get a single billing
   * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
   */
  show: compose(
    // Step 1 - create the dbQuery object with the _id of the object we need
    validationMiddleware.validateAndSetIdParam,
    // Step 2 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 3 - get data from the db and send it to client
    function (req, res, next) {
      Billing.findOne(req.dbQuery)
        .then((foundBilling) => {
          if (foundBilling) {
            return res.status(200).json(res.transform(foundBilling.toJSON(), {
              removeFields: [
                'requestHeaders',
                'createdAt',
                'updatedAt',
                '__v'
              ],
              medium: 'web'
            }));
          }
          else return next(Boom.notFound('no resource found for the given id'));
        })
        .catch((err) => {
          if (err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  ),

  /**
   * Updates a billing
   * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
   */
  //update: compose(
  //  // Step 1 - create the dbQuery object with the _id of the object we need
  //  validationMiddleware.validateAndSetIdParam,
  //  // Step 2 - create the dbQuery object based on the type of user
  //  userMiddleware.addUserIdToDbQuery,
  //  // Step 3 - get the record, update it and send it to client
  //  function (req, res, next) {
  //
  //    var billingData = req.body;
  //
  //    Billing.findOne(req.dbQuery)
  //      .then((foundBilling) => {
  //        // if no record was found, could be either the record does not exist,
  //        // or the current user has no rights to view it
  //        if (!foundBilling) {
  //          throw Boom.notFound('no resource found for given id');
  //        }
  //
  //        //loop only through the passed parameters and assign them to the record
  //        for (let key in billingData) {
  //          foundBilling[key] = billingData[key];
  //        }
  //
  //        return foundBilling.save();
  //      })
  //      .then((updatedBilling) => {
  //        res.status(200).json(updatedBilling);
  //      })
  //      .catch((err) => {
  //        if(err.isBoom) return next(err);
  //        else return next(Boom.wrap(err, 422));
  //      });
  //  }
  //),

  update: compose(
    // Step 1 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 2 - get data from the db and send it to client
    function (req, res, next) {
      Billing.find(req.dbQuery)
        .then((billings) => {
          return res.status(200).json(billings);
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  ),

  /**
   * Deletes a billing
   * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
   */
  destroy: compose(
    // Step 1 - create the dbQuery object with the _id of the object we need
    validationMiddleware.validateAndSetIdParam,
    // Step 2 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 3 - get the record and delete it
    function (req, res, next) {

      Billing.findOne(req.dbQuery)
        .then((billingToDelete) => {

          // if no record was found, could be either the record does not exist,
          // or the current user has no rights to view it
          if (!billingToDelete) {
            throw Boom.notFound('no resource found for given id');
          }

          return Billing.remove({ _id: billingToDelete._id }).exec();
        })
        .then((deletedBilling) => {
          if (deletedBilling) res.sendStatus(204);
          else return next(Boom.notFound('no resource found for given id'));
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  )
};

module.exports = BillingController;
