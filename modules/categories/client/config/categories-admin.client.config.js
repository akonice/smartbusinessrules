(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('categories.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Categories',
      state: 'admin.categories.list'
    });
    console.log("Categories");
  }
}());
