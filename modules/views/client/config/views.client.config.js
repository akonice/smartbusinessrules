(function () {
  'use strict';

  angular
    .module('views')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Views',
      state: 'views',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'views', {
      title: 'List Views',
      state: 'views.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'views', {
      title: 'Create View',
      state: 'views.create',
      roles: ['user']
    });
  }
}());
