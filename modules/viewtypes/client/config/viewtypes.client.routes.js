(function () {
  'use strict';

  angular
    .module('viewtypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('viewtypes', {
        abstract: true,
        url: '/viewtypes',
        template: '<ui-view/>'
      })
      .state('viewtypes.list', {
        url: '',
        templateUrl: 'modules/viewtypes/client/views/list-viewtypes.client.view.html',
        controller: 'ViewtypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Viewtypes List'
        }
      })
      .state('viewtypes.create', {
        url: '/create',
        templateUrl: 'modules/viewtypes/client/views/form-viewtype.client.view.html',
        controller: 'ViewtypesController',
        controllerAs: 'vm',
        resolve: {
          viewtypeResolve: newViewtype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Viewtypes Create'
        }
      })
      .state('viewtypes.edit', {
        url: '/:viewtypeId/edit',
        templateUrl: 'modules/viewtypes/client/views/form-viewtype.client.view.html',
        controller: 'ViewtypesController',
        controllerAs: 'vm',
        resolve: {
          viewtypeResolve: getViewtype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Viewtype {{ viewtypeResolve.name }}'
        }
      })
      .state('viewtypes.view', {
        url: '/:viewtypeId',
        templateUrl: 'modules/viewtypes/client/views/view-viewtype.client.view.html',
        controller: 'ViewtypesController',
        controllerAs: 'vm',
        resolve: {
          viewtypeResolve: getViewtype
        },
        data: {
          pageTitle: 'Viewtype {{ viewtypeResolve.name }}'
        }
      });
  }

  getViewtype.$inject = ['$stateParams', 'ViewtypesService'];

  function getViewtype($stateParams, ViewtypesService) {
    return ViewtypesService.get({
      viewtypeId: $stateParams.viewtypeId
    }).$promise;
  }

  newViewtype.$inject = ['ViewtypesService'];

  function newViewtype(ViewtypesService) {
    return new ViewtypesService();
  }
}());
