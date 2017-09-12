'use strict';

/**
 * Module dependencies
 */
var axetypesPolicy = require('../policies/axetypes.server.policy'),
  axetypes = require('../controllers/axetypes.server.controller');

module.exports = function(app) {
  // Axetypes Routes
  app.route('/api/axetypes').all(axetypesPolicy.isAllowed)
    .get(axetypes.list)
    .post(axetypes.create);

  app.route('/api/axetypes/:axetypeId').all(axetypesPolicy.isAllowed)
    .get(axetypes.read)
    .put(axetypes.update)
    .delete(axetypes.delete);

  // Finish by binding the Axetype middleware
  app.param('axetypeId', axetypes.axetypeByID);
};
