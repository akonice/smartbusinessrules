(function () {
  'use strict';

  angular
    .module('valuetypes',['core.config'])
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {


    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'List Valuetypes',
      state: 'valuetypes.list'
    });

   
  }
}());
