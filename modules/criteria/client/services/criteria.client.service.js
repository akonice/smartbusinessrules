// Criteria service used to communicate Criteria REST endpoints
(function () {
  'use strict';

  angular
    .module('criteria')
    .factory('CriteriaService', CriteriaService);

  CriteriaService.$inject = ['$resource'];

  function CriteriaService($resource) {
    return $resource('api/criteria/:criteriumId', {
      criteriumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
