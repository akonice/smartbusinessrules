(function () {
  'use strict';

  angular
    .module('criteria')
    .controller('CriteriaListController', CriteriaListController);

  CriteriaListController.$inject = ['CriteriaService'];

  function CriteriaListController(CriteriaService) {
    var vm = this;

    vm.criteria = CriteriaService.query();
  }
}());
