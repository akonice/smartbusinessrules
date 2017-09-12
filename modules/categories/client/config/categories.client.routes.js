(function () {
  'use strict';

  angular
    .module('categories.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('categories', {
        abstract: true,
        url: '/categories',
        template: '<ui-view/>'
      })
      .state('categories.list', {
        url: '',
        templateUrl: '/modules/categories/client/views/list-categories.client.view.html',
        controller: 'CategoriesListController',
        controllerAs: 'vm'
      })
      .state('categories.view', {
        url: '/:articleId',
        templateUrl: '/modules/categories/client/views/view-article.client.view.html',
        controller: 'CategoriesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          pageTitle: '{{ articleResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'CategoriesService'];

  function getArticle($stateParams, CategoriesService) {
    return CategoriesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }
}());
