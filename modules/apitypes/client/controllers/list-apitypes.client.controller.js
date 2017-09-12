(function () {
  'use strict';

  angular
    .module('apitypes')
    .controller('ApitypesListController', ApitypesListController);

  ApitypesListController.$inject = ['ApitypesService'];

  function ApitypesListController(ApitypesService) {
    var vm = this;

    vm.apitypes = ApitypesService.query();
  }
}());
