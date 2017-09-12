(function () {
  'use strict';

  angular
    .module('apitypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('apitypes', {
        abstract: true,
        url: '/apitypes',
        template: '<ui-view/>'
      })
      .state('apitypes.list', {
        url: '',
        templateUrl: 'modules/apitypes/client/views/list-apitypes.client.view.html',
        controller: 'ApitypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Apitypes List'
        }
      })
      .state('apitypes.create', {
        url: '/create',
        templateUrl: 'modules/apitypes/client/views/form-apitype.client.view.html',
        controller: 'ApitypesController',
        controllerAs: 'vm',
        resolve: {
          apitypeResolve: newApitype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Apitypes Create'
        }
      })
      .state('apitypes.edit', {
        url: '/:apitypeId/edit',
        templateUrl: 'modules/apitypes/client/views/form-apitype.client.view.html',
        controller: 'ApitypesController',
        controllerAs: 'vm',
        resolve: {
          apitypeResolve: getApitype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Apitype {{ apitypeResolve.name }}'
        }
      })
      .state('apitypes.view', {
        url: '/:apitypeId',
        templateUrl: 'modules/apitypes/client/views/view-apitype.client.view.html',
        controller: 'ApitypesController',
        controllerAs: 'vm',
        resolve: {
          apitypeResolve: getApitype
        },
        data: {
          pageTitle: 'Apitype {{ apitypeResolve.name }}'
        }
      });
  }

  getApitype.$inject = ['$stateParams', 'ApitypesService'];

  function getApitype($stateParams, ApitypesService) {
    return ApitypesService.get({
      apitypeId: $stateParams.apitypeId
    }).$promise;
  }

  newApitype.$inject = ['ApitypesService'];

  function newApitype(ApitypesService) {
    return new ApitypesService();
  }
}());
