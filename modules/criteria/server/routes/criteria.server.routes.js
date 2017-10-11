'use strict';

/**
 * Module dependencies
 */
var criteriaPolicy = require('../policies/criteria.server.policy'),
  criteria = require('../controllers/criteria.server.controller');

module.exports = function(app) {
  // Criteria Routes
  app.route('/api/criteria').all(criteriaPolicy.isAllowed)
    .get(criteria.list)
    .post(criteria.create);

  app.route('/api/criteria/:criteriumId').all(criteriaPolicy.isAllowed)
    .get(criteria.read)
    .put(criteria.update)
    .delete(criteria.delete);

  // Finish by binding the Criterium middleware
  app.param('criteriumId', criteria.criteriumByID);
};
