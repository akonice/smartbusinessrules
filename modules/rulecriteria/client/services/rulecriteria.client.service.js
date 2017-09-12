// Rulecriteria service used to communicate Rulecriteria REST endpoints
(function () {
  'use strict';

  angular
    .module('rulecriteria')
    .factory('RulecriteriaService', RulecriteriaService);

  RulecriteriaService.$inject = ['$resource'];

  function RulecriteriaService($resource) {
    return $resource('api/rulecriteria/:rulecriteriumId', {
      rulecriteriumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
