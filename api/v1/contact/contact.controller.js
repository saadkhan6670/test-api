'use strict';

import compose from 'composable-middleware';
import Contact from './contact.model.js';
import userMiddleware from '../../../middleware/user.middleware';
import validationMiddleware from '../../../middleware/validation.middleware';
import Boom from 'boom';

var ContactController = {

  /**
  * Get list of contacts
  * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
  */
  index: compose(
    userMiddleware.addUserIdToDbQuery,
    function (req, res, next) {
      Contact.find(req.dbQuery)
        .then((contacts) => {
          var contactList = [];
          contacts.forEach(function (contact) {
            contactList.push(res.transform(contact.toJSON(), {
              removeFields: [
                'requestHeaders',
                'createdAt',
                'updatedAt',
                '__v'
              ],
              medium: 'web'
            }));
          });
          return res.status(200).json(contactList);
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  ),

  /**
  * Creates a new contact
  * restriction: 'user' => by userId added by `addUserIdToBodyPayload` middleware
  */
  create: compose(
    userMiddleware.addUserIdToBodyPayload,
    function (req, res, next) {
      var newContact = new Contact(req.body);
      newContact.requestHeaders = req.filteredHeaders;

      newContact.save()
        .then((savedContact) => {
          return res.status(200).json(res.transform(savedContact.toJSON(), {
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
          // in case it is a validation error
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        })
    }
  ),

  /**
  * Get a single contact
  * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
  */
  show: compose(
    validationMiddleware.validateAndSetIdParam,
    userMiddleware.addUserIdToDbQuery,
    function (req, res, next) {
      Contact.findOne(req.dbQuery)
        .then((foundContact) => {
          if (foundContact) {
            return res.status(200).json(res.transform(foundContact.toJSON(), {
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
  * Updates a contact
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
  //    var contactData = req.body;
  //
  //    Contact.findOne(req.dbQuery)
  //      .then((foundContact) => {
  //        // if no record was found, could be either the record does not exist,
  //        // or the current user has no rights to view it
  //        if (!foundContact) {
  //          throw Boom.notFound('no resource found for given id');
  //        }
  //
  //        //loop only through the passed parameters and assign them to the record
  //        for (let key in contactData) {
  //          foundContact[key] = contactData[key];
  //        }
  //
  //        return foundContact.save();
  //      })
  //      .then((updatedContact) => {
  //        res.status(200).json(updatedContact);
  //      })
  //      .catch((err) => {
  //        if (err.isBoom) return next(err);
  //        else return next(Boom.wrap(err, 422));
  //      });
  //  }
  //),

  update: compose(
    userMiddleware.addUserIdToBodyPayload,
    function (req, res, next) {
      if (req.body['_id']) delete req.body['_id'];

      var newContact = new Contact(req.body);

      newContact.save()
        .then((savedContact) => {
          return res.status(200).json(res.transform(savedContact.toJSON(), {
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
          // in case it is a validation error
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        })
    }
  ),

  /**
  * Deletes a contact
  * restriction: 'user' => by userId added by `addUserIdToDbQuery` middleware
  */
  destroy: compose(
    // Step 1 - create the dbQuery object with the _id of the object we need
    validationMiddleware.validateAndSetIdParam,
    // Step 2 - create the dbQuery object based on the type of user
    userMiddleware.addUserIdToDbQuery,
    // Step 3 - get the record and delete it
    function (req, res, next) {

      Contact.findOne(req.dbQuery)
        .then((contactToDelete) => {

          // if no record was found, could be either the record does not exist,
          // or the current user has no rights to view it
          if (!contactToDelete) {
            throw Boom.notFound('no resource found for given id');
          }

          return Contact.remove({ _id: contactToDelete._id }).exec();
        })
        .then((deletedContact) => {
          if (deletedContact) res.sendStatus(204);
          else return next(Boom.notFound('no resource found for given id'));
        })
        .catch((err) => {
          if(err.isBoom) return next(err);
          else return next(Boom.wrap(err, 422));
        });
    }
  )

};

module.exports = ContactController;
