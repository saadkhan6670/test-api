'use strict';

import compose from 'composable-middleware';
import Contact from '../contact/contact.model.js';
import Cancellation from './cancellation.model.js';
import Boom from 'boom';

var CancellationController = {

  index: compose(function(req, res, next){
    Cancellation.find(req.dbQuery)
      .then((Cancellations) => {
        return res.status(200).json(Cancellations);
      })
      .catch((err) => {
        if(err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  }),

  create: compose(function(req, res, next){
    var newCancellation = new Cancellation(req.body);
    newCancellation.save()
      .then((savedCancellation) => {
        return res.status(200).json(savedCancellation);
      })
      .catch((err) => {
        if(err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      })
  }),

  show: compose(function(req, res, next){
    Cancellation.findOne(req.dbQuery)
      .then((foundCancellation) => {
        if (foundCancellation) return res.status(200).json(foundCancellation);
        else return next(Boom.notFound('no resource found for given id'));
      })
      .catch((err) => {
        if(err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  }),

  update: compose(function(req, res, next){
    if (req.body['_id']) delete req.body['_id'];
    var newCancellation = new Contact(req.body);
    newCancellation.save()
      .then((savedCancellation) => {
        return res.status(200).json(savedCancellation);
      })
      .catch((err) => {
        // in case it is a validation error
        if(err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      })
  }),

  destroy: compose(function(req, res, next){
    Cancellation.findOne(req.params.id)
      .then((CancellationToDelete) => {
        // if no record was found, could be either the record does not exist,
        // or the current user has no rights to view it
        if (!CancellationToDelete) {
          throw Boom.notFound('no resource found for given id');
        }
        return Cancellation.remove({ _id: CancellationToDelete._id }).exec();
      })
      .then((deletedCancellation) => {
        if (deletedCancellation) res.sendStatus(204);
        else return next(Boom.notFound('no resource found for given id'));
      })
      .catch((err) => {
        if(err.isBoom) return next(err);
        else return next(Boom.wrap(err, 422));
      });
  })
};

module.exports = CancellationController;
