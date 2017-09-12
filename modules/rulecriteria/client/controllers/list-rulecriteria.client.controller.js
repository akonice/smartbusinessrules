(function () {
  'use strict';

  angular
    .module('rulecriteria')
    .controller('RulecriteriaListController', RulecriteriaListController);

  RulecriteriaListController.$inject = ['RulecriteriaService'];

  function RulecriteriaListController(RulecriteriaService) {
    var vm = this;

    vm.rulecriteria = RulecriteriaService.query();
  }
}());
