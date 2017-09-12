'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Valuetypes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/valuetypes',
      permissions: '*'
    }, {
      resources: '/api/valuetypes/:valuetypeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/valuetypes',
      permissions: ['get', 'post']
    }, {
      resources: '/api/valuetypes/:valuetypeId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/valuetypes',
      permissions: ['get']
    }, {
      resources: '/api/valuetypes/:valuetypeId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Valuetypes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Valuetype is being processed and the current user created it then allow any manipulation
  if (req.valuetype && req.user && req.valuetype.user && req.valuetype.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
