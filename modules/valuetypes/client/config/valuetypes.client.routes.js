(function () {
  'use strict';

  angular
    .module('valuetypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('valuetypes', {
        abstract: true,
        url: '/valuetypes',
        template: '<ui-view/>'
      })
      .state('valuetypes.list', {
        url: '',
        templateUrl: 'modules/valuetypes/client/views/list-valuetypes.client.view.html',
        controller: 'ValuetypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Valuetypes List'
        }
      })
      .state('valuetypes.create', {
        url: '/create',
        templateUrl: 'modules/valuetypes/client/views/form-valuetype.client.view.html',
        controller: 'ValuetypesController',
        controllerAs: 'vm',
        resolve: {
          valuetypeResolve: newValuetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Valuetypes Create'
        }
      })
      .state('valuetypes.edit', {
        url: '/:valuetypeId/edit',
        templateUrl: 'modules/valuetypes/client/views/form-valuetype.client.view.html',
        controller: 'ValuetypesController',
        controllerAs: 'vm',
        resolve: {
          valuetypeResolve: getValuetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Valuetype {{ valuetypeResolve.name }}'
        }
      })
      .state('valuetypes.view', {
        url: '/:valuetypeId',
        templateUrl: 'modules/valuetypes/client/views/view-valuetype.client.view.html',
        controller: 'ValuetypesController',
        controllerAs: 'vm',
        resolve: {
          valuetypeResolve: getValuetype
        },
        data: {
          pageTitle: 'Valuetype {{ valuetypeResolve.name }}'
        }
      });
  }

  getValuetype.$inject = ['$stateParams', 'ValuetypesService'];

  function getValuetype($stateParams, ValuetypesService) {
    return ValuetypesService.get({
      valuetypeId: $stateParams.valuetypeId
    }).$promise;
  }

  newValuetype.$inject = ['ValuetypesService'];

  function newValuetype(ValuetypesService) {
    return new ValuetypesService();
  }
}());
