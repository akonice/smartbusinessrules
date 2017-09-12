(function () {
  'use strict';

  angular
    .module('categories')
    .controller('CategoriesController', CategoriesController);

  CategoriesController.$inject = ['$scope', 'categoryResolve', 'Authentication'];

  function CategoriesController($scope, category, Authentication) {
    var vm = this;

    vm.category = category;
    vm.authentication = Authentication;

  }
}());
