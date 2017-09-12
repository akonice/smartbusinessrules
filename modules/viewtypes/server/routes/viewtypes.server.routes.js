'use strict';

/**
 * Module dependencies
 */
var viewtypesPolicy = require('../policies/viewtypes.server.policy'),
  viewtypes = require('../controllers/viewtypes.server.controller');

module.exports = function(app) {
  // Viewtypes Routes
  app.route('/api/viewtypes').all(viewtypesPolicy.isAllowed)
    .get(viewtypes.list)
    .post(viewtypes.create);

  app.route('/api/viewtypes/:viewtypeId').all(viewtypesPolicy.isAllowed)
    .get(viewtypes.read)
    .put(viewtypes.update)
    .delete(viewtypes.delete);

  // Finish by binding the Viewtype middleware
  app.param('viewtypeId', viewtypes.viewtypeByID);
};
