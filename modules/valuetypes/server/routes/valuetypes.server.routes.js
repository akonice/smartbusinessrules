'use strict';

/**
 * Module dependencies
 */
var valuetypesPolicy = require('../policies/valuetypes.server.policy'),
  valuetypes = require('../controllers/valuetypes.server.controller');

module.exports = function(app) {
  // Valuetypes Routes
  app.route('/api/valuetypes').all(valuetypesPolicy.isAllowed)
    .get(valuetypes.list)
    .post(valuetypes.create);

  app.route('/api/valuetypes/:valuetypeId').all(valuetypesPolicy.isAllowed)
    .get(valuetypes.read)
    .put(valuetypes.update)
    .delete(valuetypes.delete);

  // Finish by binding the Valuetype middleware
  app.param('valuetypeId', valuetypes.valuetypeByID);
};
