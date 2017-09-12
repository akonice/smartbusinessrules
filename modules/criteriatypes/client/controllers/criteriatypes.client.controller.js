(function () {
  'use strict';

  // Criteriatypes controller
  angular
    .module('criteriatypes')
    .controller('CriteriatypesController', CriteriatypesController);

  CriteriatypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'criteriatypeResolve'];

  function CriteriatypesController ($scope, $state, $window, Authentication, criteriatype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.criteriatype = criteriatype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Criteriatype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.criteriatype.$remove($state.go('criteriatypes.list'));
      }
    }

    // Save Criteriatype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.criteriatypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.criteriatype._id) {
        vm.criteriatype.$update(successCallback, errorCallback);
      } else {
        vm.criteriatype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('criteriatypes.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
