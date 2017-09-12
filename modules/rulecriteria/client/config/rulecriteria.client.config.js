(function () {
  'use strict';

  angular
    .module('rulecriteria')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Rulecriteria',
      state: 'rulecriteria',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'rulecriteria', {
      title: 'List Rulecriteria',
      state: 'rulecriteria.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'rulecriteria', {
      title: 'Create Rulecriterium',
      state: 'rulecriteria.create',
      roles: ['user']
    });
  }
}());
