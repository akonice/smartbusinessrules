(function () {
  'use strict';

  angular
    .module('categories.admin')
    .controller('CategoriesAdminController', CategoriesAdminController);

  CategoriesAdminController.$inject = ['$scope', '$state', '$window', 'categoryResolve', 'Authentication', 'Notification'];

  function CategoriesAdminController($scope, $state, $window, category, Authentication, Notification) {
    var vm = this;

    vm.category = category;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Category
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.category.$remove(function () {
          $state.go('admin.categories.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category deleted successfully!' });
        });
      }
    }

    // Save Category
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categoryForm');
        return false;
      }

      // Create a new category, or update the current instance
      vm.category.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.categories.list'); // should we send the User to the list or the updated Category's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Category save error!' });
      }
    }
  }
}());
