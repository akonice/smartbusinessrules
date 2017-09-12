(function () {
  'use strict';

  // Rulecriteria controller
  angular
    .module('rulecriteria')
    .controller('RulecriteriaController', RulecriteriaController);

  RulecriteriaController.$inject = ['$scope', '$state', '$window', 'Authentication', 'rulecriteriumResolve'];

  function RulecriteriaController ($scope, $state, $window, Authentication, rulecriterium) {
    var vm = this;

    vm.authentication = Authentication;
    vm.rulecriterium = rulecriterium;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Rulecriterium
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rulecriterium.$remove($state.go('rulecriteria.list'));
      }
    }

    // Save Rulecriterium
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rulecriteriumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.rulecriterium._id) {
        vm.rulecriterium.$update(successCallback, errorCallback);
      } else {
        vm.rulecriterium.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('rulecriteria.view', {
          rulecriteriumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
