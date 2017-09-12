(function () {
  'use strict';

  // Axetypes controller
  angular
    .module('axetypes')
    .controller('AxetypesController', AxetypesController);

  AxetypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'axetypeResolve'];

  function AxetypesController ($scope, $state, $window, Authentication, axetype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.axetype = axetype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Axetype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.axetype.$remove($state.go('axetypes.list'));
      }
    }

    // Save Axetype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.axetypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.axetype._id) {
        vm.axetype.$update(successCallback, errorCallback);
      } else {
        vm.axetype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('axetypes.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
