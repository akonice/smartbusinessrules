(function () {
  'use strict';

  angular
    .module('rulecriteria')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rulecriteria', {
        abstract: true,
        url: '/rulecriteria',
        template: '<ui-view/>'
      })
      .state('rulecriteria.list', {
        url: '',
        templateUrl: 'modules/rulecriteria/client/views/list-rulecriteria.client.view.html',
        controller: 'RulecriteriaListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Rulecriteria List'
        }
      })
      .state('rulecriteria.create', {
        url: '/create',
        templateUrl: 'modules/rulecriteria/client/views/form-rulecriterium.client.view.html',
        controller: 'RulecriteriaController',
        controllerAs: 'vm',
        resolve: {
          rulecriteriumResolve: newRulecriterium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Rulecriteria Create'
        }
      })
      .state('rulecriteria.edit', {
        url: '/:rulecriteriumId/edit',
        templateUrl: 'modules/rulecriteria/client/views/form-rulecriterium.client.view.html',
        controller: 'RulecriteriaController',
        controllerAs: 'vm',
        resolve: {
          rulecriteriumResolve: getRulecriterium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Rulecriterium {{ rulecriteriumResolve.name }}'
        }
      })
      .state('rulecriteria.view', {
        url: '/:rulecriteriumId',
        templateUrl: 'modules/rulecriteria/client/views/view-rulecriterium.client.view.html',
        controller: 'RulecriteriaController',
        controllerAs: 'vm',
        resolve: {
          rulecriteriumResolve: getRulecriterium
        },
        data: {
          pageTitle: 'Rulecriterium {{ rulecriteriumResolve.name }}'
        }
      });
  }

  getRulecriterium.$inject = ['$stateParams', 'RulecriteriaService'];

  function getRulecriterium($stateParams, RulecriteriaService) {
    return RulecriteriaService.get({
      rulecriteriumId: $stateParams.rulecriteriumId
    }).$promise;
  }

  newRulecriterium.$inject = ['RulecriteriaService'];

  function newRulecriterium(RulecriteriaService) {
    return new RulecriteriaService();
  }
}());
