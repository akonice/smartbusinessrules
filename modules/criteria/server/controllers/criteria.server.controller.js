'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Criterium = mongoose.model('Criterium'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Criterium
 */
exports.create = function(req, res) {
  var criterium = new Criterium(req.body);
  criterium.user = req.user;

  criterium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criterium);
    }
  });
};

/**
 * Show the current Criterium
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var criterium = req.criterium ? req.criterium.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  criterium.isCurrentUserOwner = req.user && criterium.user && criterium.user._id.toString() === req.user._id.toString();

  res.jsonp(criterium);
};

/**
 * Update a Criterium
 */
exports.update = function(req, res) {
  var criterium = req.criterium;

  criterium = _.extend(criterium, req.body);

  criterium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criterium);
    }
  });
};

/**
 * Delete an Criterium
 */
exports.delete = function(req, res) {
  var criterium = req.criterium;

  criterium.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criterium);
    }
  });
};

/**
 * List of Criteria
 */
exports.list = function(req, res) {
  Criterium.find().sort('-created').populate('user', 'displayName').exec(function(err, criteria) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criteria);
    }
  });
};

/**
 * Criterium middleware
 */
exports.criteriumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Criterium is invalid'
    });
  }

  Criterium.findById(id).populate('user', 'displayName').exec(function (err, criterium) {
    if (err) {
      return next(err);
    } else if (!criterium) {
      return res.status(404).send({
        message: 'No Criterium with that identifier has been found'
      });
    }
    req.criterium = criterium;
    next();
  });
};
