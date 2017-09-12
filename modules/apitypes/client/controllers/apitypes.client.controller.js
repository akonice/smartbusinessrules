(function () {
  'use strict';

  // Apitypes controller
  angular
    .module('apitypes')
    .controller('ApitypesController', ApitypesController);

  ApitypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'apitypeResolve'];

  function ApitypesController ($scope, $state, $window, Authentication, apitype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.apitype = apitype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Apitype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.apitype.$remove($state.go('apitypes.list'));
      }
    }

    // Save Apitype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.apitypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.apitype._id) {
        vm.apitype.$update(successCallback, errorCallback);
      } else {
        vm.apitype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('apitypes.list', {
          apitypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
