'use strict';

/**
 * Module dependencies
 */
var rulecriteriaPolicy = require('../policies/rulecriteria.server.policy'),
  rulecriteria = require('../controllers/rulecriteria.server.controller');

module.exports = function(app) {
  // Rulecriteria Routes
  app.route('/api/rulecriteria').all(rulecriteriaPolicy.isAllowed)
    .get(rulecriteria.list)
    .post(rulecriteria.create);

  app.route('/api/rulecriteria/:rulecriteriumId').all(rulecriteriaPolicy.isAllowed)
    .get(rulecriteria.read)
    .put(rulecriteria.update)
    .delete(rulecriteria.delete);

  // Finish by binding the Rulecriterium middleware
  app.param('rulecriteriumId', rulecriteria.rulecriteriumByID);
};
