(function () {
  'use strict';

  angular
    .module('viewtypes')
    .controller('ViewtypesListController', ViewtypesListController);

  ViewtypesListController.$inject = ['ViewtypesService'];

  function ViewtypesListController(ViewtypesService) {
    var vm = this;

    vm.viewtypes = ViewtypesService.query();
  }
}());
