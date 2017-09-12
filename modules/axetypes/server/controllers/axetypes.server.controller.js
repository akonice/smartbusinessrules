'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Axetype = mongoose.model('Axetype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Axetype
 */
exports.create = function(req, res) {
  var axetype = new Axetype(req.body);
  axetype.user = req.user;

  axetype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(axetype);
    }
  });
};

/**
 * Show the current Axetype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var axetype = req.axetype ? req.axetype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  axetype.isCurrentUserOwner = req.user && axetype.user && axetype.user._id.toString() === req.user._id.toString();

  res.jsonp(axetype);
};

/**
 * Update a Axetype
 */
exports.update = function(req, res) {
  var axetype = req.axetype;

  axetype = _.extend(axetype, req.body);

  axetype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(axetype);
    }
  });
};

/**
 * Delete an Axetype
 */
exports.delete = function(req, res) {
  var axetype = req.axetype;

  axetype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(axetype);
    }
  });
};

/**
 * List of Axetypes
 */
exports.list = function(req, res) {
  Axetype.find().sort('-created').populate('user', 'displayName').exec(function(err, axetypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(axetypes);
    }
  });
};

/**
 * Axetype middleware
 */
exports.axetypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Axetype is invalid'
    });
  }

  Axetype.findById(id).populate('user', 'displayName').exec(function (err, axetype) {
    if (err) {
      return next(err);
    } else if (!axetype) {
      return res.status(404).send({
        message: 'No Axetype with that identifier has been found'
      });
    }
    req.axetype = axetype;
    next();
  });
};
