(function () {
  'use strict';

  angular
    .module('axetypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('axetypes', {
        abstract: true,
        url: '/axetypes',
        template: '<ui-view/>'
      })
      .state('axetypes.list', {
        url: '',
        templateUrl: 'modules/axetypes/client/views/list-axetypes.client.view.html',
        controller: 'AxetypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Axetypes List'
        }
      })
      .state('axetypes.create', {
        url: '/create',
        templateUrl: 'modules/axetypes/client/views/form-axetype.client.view.html',
        controller: 'AxetypesController',
        controllerAs: 'vm',
        resolve: {
          axetypeResolve: newAxetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Axetypes Create'
        }
      })
      .state('axetypes.edit', {
        url: '/:axetypeId/edit',
        templateUrl: 'modules/axetypes/client/views/form-axetype.client.view.html',
        controller: 'AxetypesController',
        controllerAs: 'vm',
        resolve: {
          axetypeResolve: getAxetype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Axetype {{ axetypeResolve.name }}'
        }
      })
      .state('axetypes.view', {
        url: '/:axetypeId',
        templateUrl: 'modules/axetypes/client/views/view-axetype.client.view.html',
        controller: 'AxetypesController',
        controllerAs: 'vm',
        resolve: {
          axetypeResolve: getAxetype
        },
        data: {
          pageTitle: 'Axetype {{ axetypeResolve.name }}'
        }
      });
  }

  getAxetype.$inject = ['$stateParams', 'AxetypesService'];

  function getAxetype($stateParams, AxetypesService) {
    return AxetypesService.get({
      axetypeId: $stateParams.axetypeId
    }).$promise;
  }

  newAxetype.$inject = ['AxetypesService'];

  function newAxetype(AxetypesService) {
    return new AxetypesService();
  }
}());
