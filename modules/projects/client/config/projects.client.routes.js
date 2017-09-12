(function () {
  'use strict';

  angular
    .module('projects')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view/>'
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'modules/projects/client/views/list-projects.client.view.html',
        controller: 'ProjectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Projects List'
        }
      })
      .state('projects.details', {
        url: '/:projectId',
        templateUrl: 'modules/projects/client/views/projects.client.view.html',
        controller: 'ProjectsDetailsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Projects Detail'
        }
      })      
      .state('projects.create', {
        url: '/create',
        templateUrl: 'modules/projects/client/views/form-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: newProject
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Projects Create'
        }
      })
      .state('projects.details.edit', {
        url: '/edit',
        templateUrl: 'modules/projects/client/views/form-project.client.view.html',
        controller: 'ProjectsEditDetailsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('projects.details.categories', {
        url: '/categories',
        templateUrl: '/modules/projects/client/views/list-categories.client.view.html',
        controller: 'ProjectsCategoriesListController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },        
        data: {
          roles: ['user', 'admin']
        }
      })      
      .state('projects.view', {
        url: '/:projectId',
        templateUrl: 'modules/projects/client/views/view-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },
        data: {
          pageTitle: 'Project {{ projectResolve.name }}'
        }
      });
  }

  getProject.$inject = ['$stateParams', 'ProjectsService'];

  function getProject($stateParams, ProjectsService) {
    return ProjectsService.get({
      projectId: $stateParams.projectId
    }).$promise;
  }

  newProject.$inject = ['ProjectsService'];

  function newProject(ProjectsService) {
    return new ProjectsService();
  }
}());
