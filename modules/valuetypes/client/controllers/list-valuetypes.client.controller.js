(function () {
  'use strict';

  angular
    .module('valuetypes')
    .controller('ValuetypesListController', ValuetypesListController);

  ValuetypesListController.$inject = ['ValuetypesService'];

  function ValuetypesListController(ValuetypesService) {
    var vm = this;

    vm.valuetypes = ValuetypesService.query();
  }
}());
