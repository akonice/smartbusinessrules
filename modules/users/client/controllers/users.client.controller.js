(function () {
  'use strict';

  // Users controller
  angular
    .module('users')
    .controller('UsersController', UsersController);

  UsersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve'];

  function UsersController ($scope, $state, $window, Authentication, user) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing User
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.user.$remove($state.go('users.list'));
      }
    }

    // Save User
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.user._id) {
        vm.user.$update(successCallback, errorCallback);
      } else {
        vm.user.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('users.view', {
          userId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
