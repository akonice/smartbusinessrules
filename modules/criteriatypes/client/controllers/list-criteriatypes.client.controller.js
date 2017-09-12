(function () {
  'use strict';

  angular
    .module('criteriatypes')
    .controller('CriteriatypesListController', CriteriatypesListController);

  CriteriatypesListController.$inject = ['CriteriatypesService'];

  function CriteriatypesListController(CriteriatypesService) {
    var vm = this;

    vm.criteriatypes = CriteriatypesService.query();
  }
}());
