(function () {
  'use strict';

  angular
    .module('users')
    .controller('UsersListController', UsersListController);

  UsersListController.$inject = ['UsersService'];

  function UsersListController(UsersService) {
    var vm = this;

    vm.users = UsersService.query();
  }
}());
