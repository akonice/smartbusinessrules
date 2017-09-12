// Axetypes service used to communicate Axetypes REST endpoints
(function () {
  'use strict';

  angular
    .module('axetypes')
    .factory('AxetypesService', AxetypesService);

  AxetypesService.$inject = ['$resource'];

  function AxetypesService($resource) {
    return $resource('/api/axetypes/:axetypeId', {
      axetypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
