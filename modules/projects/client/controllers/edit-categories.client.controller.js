(function () {
  'use strict';

  angular
    .module('categories.admin')
    .controller('ProjectsCategoriesEditController', ProjectsCategoriesEditController);

  ProjectsCategoriesEditController.$inject = ['$scope', '$state', '$window', 'categoryResolve','projectResolve','$uibModalInstance','Notification'];

  function ProjectsCategoriesEditController($scope, $state, $window, category,project,$uibModalInstance,Notification) {
    var vm = this;

    vm.category = category;
    vm.category.project = project;
    console.log(project);
    //vm.remove = remove;
    vm.save = save;
    vm.clear = clear;
    
    function clear () {
       $uibModalInstance.dismiss('cancel');
    }

    // Remove existing Category
    /**function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.category.$remove(function () {
          $state.go('admin.categories.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category deleted successfully!' });
        });
      }
    }**/

    // Save Category
    function save(isValid) {
      //console.log(vm.category);
      //return;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.categoryForm');
        return false;
      }

      // Create a new category, or update the current instance
      vm.category.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $uibModalInstance.close(res);
        //$state.go('admin.categories.list'); // should we send the User to the list or the updated Category's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Category save error!' });
      }
    }
  }
}());


