// Viewtypes service used to communicate Viewtypes REST endpoints
(function () {
  'use strict';

  angular
    .module('viewtypes')
    .factory('ViewtypesService', ViewtypesService);

  ViewtypesService.$inject = ['$resource'];

  function ViewtypesService($resource) {
    return $resource('/api/viewtypes/:viewtypeId', {
      viewtypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
