(function () {
  'use strict';

  angular
    .module('axetypes',['core.config'])
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'Axe Types',
      state: 'axetypes.list'
    });

  }
}());
