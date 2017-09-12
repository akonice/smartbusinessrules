(function () {
  'use strict';

  angular
    .module('axetypes')
    .controller('AxetypesListController', AxetypesListController);

  AxetypesListController.$inject = ['AxetypesService'];

  function AxetypesListController(AxetypesService) {
    var vm = this;

    vm.axetypes = AxetypesService.query();
  }
}());
