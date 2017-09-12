(function () {
  'use strict';

  angular
    .module('categories.admin')
    .controller('CategoriesAdminListController', CategoriesAdminListController);

  CategoriesAdminListController.$inject = ['CategoriesService'];

  function CategoriesAdminListController(CategoriesService) {
    var vm = this;

    vm.categories = CategoriesService.query();
  }
}());
