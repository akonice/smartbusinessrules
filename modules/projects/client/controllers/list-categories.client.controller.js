(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsCategoriesListController', ProjectsCategoriesListController);

  ProjectsCategoriesListController.$inject = ['$scope', '$filter','CategoriesService'];

  function ProjectsCategoriesListController(CategoriesService) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    CategoriesService.query(function (data) {
      vm.categories = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 1;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.categories, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }





  }
}());
