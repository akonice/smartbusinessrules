'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Criteriatype = mongoose.model('Criteriatype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Criteriatype
 */
exports.create = function(req, res) {
  var criteriatype = new Criteriatype(req.body);
  criteriatype.user = req.user;

  criteriatype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criteriatype);
    }
  });
};

/**
 * Show the current Criteriatype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var criteriatype = req.criteriatype ? req.criteriatype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  criteriatype.isCurrentUserOwner = req.user && criteriatype.user && criteriatype.user._id.toString() === req.user._id.toString();

  res.jsonp(criteriatype);
};

/**
 * Update a Criteriatype
 */
exports.update = function(req, res) {
  var criteriatype = req.criteriatype;

  criteriatype = _.extend(criteriatype, req.body);

  criteriatype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criteriatype);
    }
  });
};

/**
 * Delete an Criteriatype
 */
exports.delete = function(req, res) {
  var criteriatype = req.criteriatype;

  criteriatype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criteriatype);
    }
  });
};

/**
 * List of Criteriatypes
 */
exports.list = function(req, res) {
  Criteriatype.find().sort('-created').populate('user', 'displayName').exec(function(err, criteriatypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(criteriatypes);
    }
  });
};

/**
 * Criteriatype middleware
 */
exports.criteriatypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Criteriatype is invalid'
    });
  }

  Criteriatype.findById(id).populate('user', 'displayName').exec(function (err, criteriatype) {
    if (err) {
      return next(err);
    } else if (!criteriatype) {
      return res.status(404).send({
        message: 'No Criteriatype with that identifier has been found'
      });
    }
    req.criteriatype = criteriatype;
    next();
  });
};
