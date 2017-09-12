// Apitypes service used to communicate Apitypes REST endpoints
(function () {
  'use strict';

  angular
    .module('apitypes')
    .factory('ApitypesService', ApitypesService);

  ApitypesService.$inject = ['$resource'];

  function ApitypesService($resource) {
    return $resource('/api/apitypes/:apitypeId', {
      apitypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
