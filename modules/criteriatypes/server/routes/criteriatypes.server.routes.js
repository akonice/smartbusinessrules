'use strict';

/**
 * Module dependencies
 */
var criteriatypesPolicy = require('../policies/criteriatypes.server.policy'),
  criteriatypes = require('../controllers/criteriatypes.server.controller');

module.exports = function(app) {
  // Criteriatypes Routes
  app.route('/api/criteriatypes').all(criteriatypesPolicy.isAllowed)
    .get(criteriatypes.list)
    .post(criteriatypes.create);

  app.route('/api/criteriatypes/:criteriatypeId').all(criteriatypesPolicy.isAllowed)
    .get(criteriatypes.read)
    .put(criteriatypes.update)
    .delete(criteriatypes.delete);

  // Finish by binding the Criteriatype middleware
  app.param('criteriatypeId', criteriatypes.criteriatypeByID);
};
