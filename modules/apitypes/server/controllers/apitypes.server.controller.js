'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Apitype = mongoose.model('Apitype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Apitype
 */
exports.create = function(req, res) {
  var apitype = new Apitype(req.body);
  apitype.user = req.user;

  apitype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(apitype);
    }
  });
};

/**
 * Show the current Apitype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var apitype = req.apitype ? req.apitype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  apitype.isCurrentUserOwner = req.user && apitype.user && apitype.user._id.toString() === req.user._id.toString();

  res.jsonp(apitype);
};

/**
 * Update a Apitype
 */
exports.update = function(req, res) {
  var apitype = req.apitype;

  apitype = _.extend(apitype, req.body);

  apitype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(apitype);
    }
  });
};

/**
 * Delete an Apitype
 */
exports.delete = function(req, res) {
  var apitype = req.apitype;

  apitype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(apitype);
    }
  });
};

/**
 * List of Apitypes
 */
exports.list = function(req, res) {
  Apitype.find().sort('-created').populate('user', 'displayName').exec(function(err, apitypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(apitypes);
    }
  });
};

/**
 * Apitype middleware
 */
exports.apitypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Apitype is invalid'
    });
  }

  Apitype.findById(id).populate('user', 'displayName').exec(function (err, apitype) {
    if (err) {
      return next(err);
    } else if (!apitype) {
      return res.status(404).send({
        message: 'No Apitype with that identifier has been found'
      });
    }
    req.apitype = apitype;
    next();
  });
};
