'use strict';

import compose from 'composable-middleware';
import Traveller from './traveller.model';
import userMiddleware from '../../../middleware/user.middleware';
import validationMiddleware from '../../../middleware/validation.middleware';
import Boom from 'boom';
import _ from 'lodash';

var TravellerController = {
  /**
  * Get list of travellers
  * restriction 'user' => by userId added by `addUserIdToDbQuery` middleware
  */
  index: compose(
    // Step 1 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 2 - get data from the db and send it to client
    function (req, res, next) {
      Traveller.find(req.dbQuery).sort('-createdAt')
       .then((travellers) => {
         var travellerList = [];
         travellers.forEach(function (traveller) {
           travellerList.push(res.transform(traveller.toJSON(), {
             removeFields: [
               'requestHeaders',
               'createdAt',
               'updatedAt',
               'registeredAt',
               '__v'
             ],
             medium: 'web'
           }));
         });
         return res.status(200).json(travellerList);
       })
       .catch((err) => {
         if(err.isBoom) return next(err);
         else return next(Boom.wrap(err, 422));
       });
    }
  ),

  /**
   * Creates a new traveller
   * restriction 'user' => by userId added by `addUserIdToBodyPayload` middleware
   */
  create: compose(
    //Step 1 - build the body of the traveller (payload)
    userMiddleware.addUserIdToBodyPayload,
    //Step 2 - insert the record to the db and send it to the client
    function (req, res, next) {
      var newTraveller = new Traveller(req.body);
      newTraveller.requestHeaders = req.filteredHeaders;

      newTraveller.save()
        .then((savedTraveller) => {
          return res.status(200).json(res.transform(savedTraveller.toJSON(), {
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
   * Get a single traveller
   * restriction 'user' => by userId added by `addUserIdToDbQuery` middleware
   */
  show: compose(
    // Step 1 - create the dbQuery object with the _id of the object we need
    validationMiddleware.validateAndSetIdParam,
    // Step 2 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 3 - get data from the db and send it to client
    function (req, res, next) {
      Traveller.findOne(req.dbQuery)
        .then((foundTraveller) => {
          if (foundTraveller) {
            return res.status(200).json(res.transform(foundTraveller.toJSON(), {
              removeFields: [
                'requestHeaders',
                'createdAt',
                'updatedAt',
                '__v'
              ],
              medium: 'web'
            }));
          }
          else return next(Boom.notFound('no resource found for given id'));
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  ),

  /**
   * Updates a billing
   * restriction 'user' => by userId by userId added by `addUserIdToDbQuery` middleware
   */
  update: compose(
    // Step 1 - create the dbQuery object with the _id of the object we need
    validationMiddleware.validateAndSetIdParam,
    // Step 2 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 3 - get the record, update it and send it to client
    function (req, res, next) {

      var travellerData = req.body;

      Traveller.findOne(req.dbQuery)
        .then((foundTraveller) => {
          // if no record was found, could be either the record does not exist,
          // or the current user has no rights to view it
          if (!foundTraveller) {
            throw Boom.notFound('no resource found for given id');
          }

          _.assignIn(foundTraveller, travellerData);

          return foundTraveller.save();
        })
        .then((updatedTraveller) => {
          res.status(200).json(res.transform(updatedTraveller.toJSON(), {
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
        });
    }
  ),

  /**
   * Deletes a billing
   * restriction 'user' => by userId by userId added by `addUserIdToDbQuery` middleware
   */
  destroy: compose(
    // Step 1 - create the dbQuery object with the _id of the object we need
    validationMiddleware.validateAndSetIdParam,
    // Step 2 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 3 - get the record and delete it
    function (req, res, next) {

      Traveller.findOne(req.dbQuery)
        .then((travellerToDelete) => {

          // if no record was found, could be either the record does not exist,
          // or the current user has no rights to view it
          if (!travellerToDelete) {
            throw Boom.notFound('no resource found for given id');
          }

          return Traveller.remove({ _id: travellerToDelete._id }).exec();
        })
        .then((deletedTraveller) => {
          if (deletedTraveller) res.sendStatus(204);
          else return next(Boom.notFound('no resource found for given id'));
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  )
};

module.exports = TravellerController;
