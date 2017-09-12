(function () {
  'use strict';

  // Viewtypes controller
  angular
    .module('viewtypes')
    .controller('ViewtypesController', ViewtypesController);

  ViewtypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'viewtypeResolve'];

  function ViewtypesController ($scope, $state, $window, Authentication, viewtype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.viewtype = viewtype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Viewtype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.viewtype.$remove($state.go('viewtypes.list'));
      }
    }

    // Save Viewtype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.viewtypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.viewtype._id) {
        vm.viewtype.$update(successCallback, errorCallback);
      } else {
        vm.viewtype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('viewtypes.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
