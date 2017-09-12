(function () {
  'use strict';

  angular
    .module('projects',['core.config'])
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
  
    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Project',
      state: 'projects.list',
      roles: ['admin']
    });
  }
}());
