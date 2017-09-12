(function () {
  'use strict';

  angular
    .module('criteriatypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('criteriatypes', {
        abstract: true,
        url: '/criteriatypes',
        template: '<ui-view/>'
      })
      .state('criteriatypes.list', {
        url: '',
        templateUrl: 'modules/criteriatypes/client/views/list-criteriatypes.client.view.html',
        controller: 'CriteriatypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Criteriatypes List'
        }
      })
      .state('criteriatypes.create', {
        url: '/create',
        templateUrl: 'modules/criteriatypes/client/views/form-criteriatype.client.view.html',
        controller: 'CriteriatypesController',
        controllerAs: 'vm',
        resolve: {
          criteriatypeResolve: newCriteriatype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Criteriatypes Create'
        }
      })
      .state('criteriatypes.edit', {
        url: '/:criteriatypeId/edit',
        templateUrl: 'modules/criteriatypes/client/views/form-criteriatype.client.view.html',
        controller: 'CriteriatypesController',
        controllerAs: 'vm',
        resolve: {
          criteriatypeResolve: getCriteriatype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Criteriatype {{ criteriatypeResolve.name }}'
        }
      })
      .state('criteriatypes.view', {
        url: '/:criteriatypeId',
        templateUrl: 'modules/criteriatypes/client/views/view-criteriatype.client.view.html',
        controller: 'CriteriatypesController',
        controllerAs: 'vm',
        resolve: {
          criteriatypeResolve: getCriteriatype
        },
        data: {
          pageTitle: 'Criteriatype {{ criteriatypeResolve.name }}'
        }
      });
  }

  getCriteriatype.$inject = ['$stateParams', 'CriteriatypesService'];

  function getCriteriatype($stateParams, CriteriatypesService) {
    return CriteriatypesService.get({
      criteriatypeId: $stateParams.criteriatypeId
    }).$promise;
  }

  newCriteriatype.$inject = ['CriteriatypesService'];

  function newCriteriatype(CriteriatypesService) {
    return new CriteriatypesService();
  }
}());
