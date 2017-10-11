(function () {
  'use strict';

  // Criteria controller
  angular
    .module('criteria')
    .controller('CriteriaController', CriteriaController);

  CriteriaController.$inject = ['$scope', '$state', '$window', 'Authentication', 'criteriumResolve'];

  function CriteriaController ($scope, $state, $window, Authentication, criterium) {
    var vm = this;

    vm.authentication = Authentication;
    vm.criterium = criterium;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Criterium
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.criterium.$remove($state.go('criteria.list'));
      }
    }

    // Save Criterium
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.criteriumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.criterium._id) {
        vm.criterium.$update(successCallback, errorCallback);
      } else {
        vm.criterium.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('criteria.view', {
          criteriumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
