'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Viewtype = mongoose.model('Viewtype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Viewtype
 */
exports.create = function(req, res) {
  var viewtype = new Viewtype(req.body);
  viewtype.user = req.user;

  viewtype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(viewtype);
    }
  });
};

/**
 * Show the current Viewtype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var viewtype = req.viewtype ? req.viewtype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  viewtype.isCurrentUserOwner = req.user && viewtype.user && viewtype.user._id.toString() === req.user._id.toString();

  res.jsonp(viewtype);
};

/**
 * Update a Viewtype
 */
exports.update = function(req, res) {
  var viewtype = req.viewtype;

  viewtype = _.extend(viewtype, req.body);

  viewtype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(viewtype);
    }
  });
};

/**
 * Delete an Viewtype
 */
exports.delete = function(req, res) {
  var viewtype = req.viewtype;

  viewtype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(viewtype);
    }
  });
};

/**
 * List of Viewtypes
 */
exports.list = function(req, res) {
  Viewtype.find().sort('-created').populate('user', 'displayName').exec(function(err, viewtypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(viewtypes);
    }
  });
};

/**
 * Viewtype middleware
 */
exports.viewtypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Viewtype is invalid'
    });
  }

  Viewtype.findById(id).populate('user', 'displayName').exec(function (err, viewtype) {
    if (err) {
      return next(err);
    } else if (!viewtype) {
      return res.status(404).send({
        message: 'No Viewtype with that identifier has been found'
      });
    }
    req.viewtype = viewtype;
    next();
  });
};
