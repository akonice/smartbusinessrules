// Criteriatypes service used to communicate Criteriatypes REST endpoints
(function () {
  'use strict';

  angular
    .module('criteriatypes')
    .factory('CriteriatypesService', CriteriatypesService);

  CriteriatypesService.$inject = ['$resource'];

  function CriteriatypesService($resource) {
    return $resource('/api/criteriatypes/:criteriatypeId', {
      criteriatypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
