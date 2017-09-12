(function () {
  'use strict';

  angular
    .module('core.config')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Configuration',
      state: 'config',
      type: 'dropdown',
      roles: ['admin']
    });
    menuService.addMenuItem('topbar', {
      title: 'System',
      state: 'system',
      type: 'dropdown',
      roles: ['admin']
    });    


  }
}());
