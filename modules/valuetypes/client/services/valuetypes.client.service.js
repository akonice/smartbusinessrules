// Valuetypes service used to communicate Valuetypes REST endpoints
(function () {
  'use strict';

  angular
    .module('valuetypes')
    .factory('ValuetypesService', ValuetypesService);

  ValuetypesService.$inject = ['$resource'];

  function ValuetypesService($resource) {
    return $resource('/api/valuetypes/:valuetypeId', {
      valuetypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
