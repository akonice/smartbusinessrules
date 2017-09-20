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
      .state('projects.details.edit.categories',{
        url: '/categories',       
        data: {
          roles: ['user', 'admin']
        },
        onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: '/modules/projects/client/views/edit-categories.client.view.html',
                    controller: 'ProjectsCategoriesEditController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        projectResolve: getProject,
                        categoryResolve:newCategorie
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
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
  
  
  getCategorie.$inject = ['$stateParams', 'CategoriesService'];

  function getCategorie($stateParams, CategoriesService) {
    return CategoriesService.get({
      categoryId: $stateParams.categoryId
    }).$promise;
  }

  newCategorie.$inject = ['CategoriesService'];

  function newCategorie(CategoriesService) {
    return new CategoriesService();
  }
}());
