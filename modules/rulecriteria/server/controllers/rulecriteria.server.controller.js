'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rulecriterium = mongoose.model('Rulecriterium'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Rulecriterium
 */
exports.create = function(req, res) {
  var rulecriterium = new Rulecriterium(req.body);
  rulecriterium.user = req.user;

  rulecriterium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulecriterium);
    }
  });
};

/**
 * Show the current Rulecriterium
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var rulecriterium = req.rulecriterium ? req.rulecriterium.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rulecriterium.isCurrentUserOwner = req.user && rulecriterium.user && rulecriterium.user._id.toString() === req.user._id.toString();

  res.jsonp(rulecriterium);
};

/**
 * Update a Rulecriterium
 */
exports.update = function(req, res) {
  var rulecriterium = req.rulecriterium;

  rulecriterium = _.extend(rulecriterium, req.body);

  rulecriterium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulecriterium);
    }
  });
};

/**
 * Delete an Rulecriterium
 */
exports.delete = function(req, res) {
  var rulecriterium = req.rulecriterium;

  rulecriterium.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulecriterium);
    }
  });
};

/**
 * List of Rulecriteria
 */
exports.list = function(req, res) {
  Rulecriterium.find().sort('-created').populate('user', 'displayName').exec(function(err, rulecriteria) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulecriteria);
    }
  });
};

/**
 * Rulecriterium middleware
 */
exports.rulecriteriumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rulecriterium is invalid'
    });
  }

  Rulecriterium.findById(id).populate('user', 'displayName').exec(function (err, rulecriterium) {
    if (err) {
      return next(err);
    } else if (!rulecriterium) {
      return res.status(404).send({
        message: 'No Rulecriterium with that identifier has been found'
      });
    }
    req.rulecriterium = rulecriterium;
    next();
  });
};
