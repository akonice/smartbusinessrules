(function () {
  'use strict';

  angular
    .module('viewtypes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'View types',
      state: 'viewtypes.list'
    });
  }
}());
