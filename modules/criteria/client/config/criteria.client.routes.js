(function () {
  'use strict';

  angular
    .module('criteria')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('criteria', {
        abstract: true,
        url: '/criteria',
        template: '<ui-view/>'
      })
      .state('criteria.list', {
        url: '',
        templateUrl: 'modules/criteria/client/views/list-criteria.client.view.html',
        controller: 'CriteriaListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Criteria List'
        }
      })
      .state('criteria.create', {
        url: '/create',
        templateUrl: 'modules/criteria/client/views/form-criterium.client.view.html',
        controller: 'CriteriaController',
        controllerAs: 'vm',
        resolve: {
          criteriumResolve: newCriterium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Criteria Create'
        }
      })
      .state('criteria.edit', {
        url: '/:criteriumId/edit',
        templateUrl: 'modules/criteria/client/views/form-criterium.client.view.html',
        controller: 'CriteriaController',
        controllerAs: 'vm',
        resolve: {
          criteriumResolve: getCriterium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Criterium {{ criteriumResolve.name }}'
        }
      })
      .state('criteria.view', {
        url: '/:criteriumId',
        templateUrl: 'modules/criteria/client/views/view-criterium.client.view.html',
        controller: 'CriteriaController',
        controllerAs: 'vm',
        resolve: {
          criteriumResolve: getCriterium
        },
        data: {
          pageTitle: 'Criterium {{ criteriumResolve.name }}'
        }
      });
  }

  getCriterium.$inject = ['$stateParams', 'CriteriaService'];

  function getCriterium($stateParams, CriteriaService) {
    return CriteriaService.get({
      criteriumId: $stateParams.criteriumId
    }).$promise;
  }

  newCriterium.$inject = ['CriteriaService'];

  function newCriterium(CriteriaService) {
    return new CriteriaService();
  }
}());
