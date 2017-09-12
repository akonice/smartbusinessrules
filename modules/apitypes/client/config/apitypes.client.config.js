(function () {
  'use strict';

  angular
    .module('apitypes')
    //.run(menuConfig)
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];


  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Apitypes',
      state: 'apitypes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'apitypes', {
      title: 'List Apitypes',
      state: 'apitypes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'apitypes', {
      title: 'Create Apitype',
      state: 'apitypes.create',
      roles: ['user']
    });

//
/*
    menuService.addSubMenuItem('topbar', 'config', {
      title: 'Manage Api Type',
      state: 'apitype.list',
      roles: ['*']
    });
*/
  }
}());
