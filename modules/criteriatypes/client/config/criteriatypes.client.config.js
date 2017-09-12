(function () {
  'use strict';

  angular
    .module('criteriatypes', ['core.config'])
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {


    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'List Criteriatypes',
      state: 'criteriatypes.list'
    });

  }
}());
