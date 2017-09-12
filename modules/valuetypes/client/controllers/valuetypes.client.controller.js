(function () {
  'use strict';

  // Valuetypes controller
  angular
    .module('valuetypes')
    .controller('ValuetypesController', ValuetypesController);

  ValuetypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'valuetypeResolve'];

  function ValuetypesController ($scope, $state, $window, Authentication, valuetype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.valuetype = valuetype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Valuetype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.valuetype.$remove($state.go('valuetypes.list'));
      }
    }

    // Save Valuetype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.valuetypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.valuetype._id) {
        vm.valuetype.$update(successCallback, errorCallback);
      } else {
        vm.valuetype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('valuetypes.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
