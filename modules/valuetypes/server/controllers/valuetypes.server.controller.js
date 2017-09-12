'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Valuetype = mongoose.model('Valuetype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Valuetype
 */
exports.create = function(req, res) {
  var valuetype = new Valuetype(req.body);
  valuetype.user = req.user;

  valuetype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(valuetype);
    }
  });
};

/**
 * Show the current Valuetype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var valuetype = req.valuetype ? req.valuetype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  valuetype.isCurrentUserOwner = req.user && valuetype.user && valuetype.user._id.toString() === req.user._id.toString();

  res.jsonp(valuetype);
};

/**
 * Update a Valuetype
 */
exports.update = function(req, res) {
  var valuetype = req.valuetype;

  valuetype = _.extend(valuetype, req.body);

  valuetype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(valuetype);
    }
  });
};

/**
 * Delete an Valuetype
 */
exports.delete = function(req, res) {
  var valuetype = req.valuetype;

  valuetype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(valuetype);
    }
  });
};

/**
 * List of Valuetypes
 */
exports.list = function(req, res) {
  Valuetype.find().sort('-created').populate('user', 'displayName').exec(function(err, valuetypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(valuetypes);
    }
  });
};

/**
 * Valuetype middleware
 */
exports.valuetypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Valuetype is invalid'
    });
  }

  Valuetype.findById(id).populate('user', 'displayName').exec(function (err, valuetype) {
    if (err) {
      return next(err);
    } else if (!valuetype) {
      return res.status(404).send({
        message: 'No Valuetype with that identifier has been found'
      });
    }
    req.valuetype = valuetype;
    next();
  });
};
