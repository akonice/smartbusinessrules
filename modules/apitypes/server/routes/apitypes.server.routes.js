'use strict';

/**
 * Module dependencies
 */
var apitypesPolicy = require('../policies/apitypes.server.policy'),
  apitypes = require('../controllers/apitypes.server.controller');

module.exports = function(app) {
  // Apitypes Routes
  app.route('/api/apitypes').all(apitypesPolicy.isAllowed)
    .get(apitypes.list)
    .post(apitypes.create);

  app.route('/api/apitypes/:apitypeId').all(apitypesPolicy.isAllowed)
    .get(apitypes.read)
    .put(apitypes.update)
    .delete(apitypes.delete);

  // Finish by binding the Apitype middleware
  app.param('apitypeId', apitypes.apitypeByID);
};
