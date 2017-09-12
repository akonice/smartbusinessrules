(function () {
  'use strict';

  describe('Axetypes Controller Tests', function () {
    // Initialize global variables
    var AxetypesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AxetypesService,
      mockAxetype;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AxetypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AxetypesService = _AxetypesService_;

      // create mock Axetype
      mockAxetype = new AxetypesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Axetype Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Axetypes controller.
      AxetypesController = $controller('AxetypesController as vm', {
        $scope: $scope,
        axetypeResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleAxetypePostData;

      beforeEach(function () {
        // Create a sample Axetype object
        sampleAxetypePostData = new AxetypesService({
          name: 'Axetype Name'
        });

        $scope.vm.axetype = sampleAxetypePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (AxetypesService) {
        // Set POST response
        $httpBackend.expectPOST('api/axetypes', sampleAxetypePostData).respond(mockAxetype);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Axetype was created
        expect($state.go).toHaveBeenCalledWith('axetypes.view', {
          axetypeId: mockAxetype._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/axetypes', sampleAxetypePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Axetype in $scope
        $scope.vm.axetype = mockAxetype;
      });

      it('should update a valid Axetype', inject(function (AxetypesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/axetypes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('axetypes.view', {
          axetypeId: mockAxetype._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (AxetypesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/axetypes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Axetypes
        $scope.vm.axetype = mockAxetype;
      });

      it('should delete the Axetype and redirect to Axetypes', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/axetypes\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('axetypes.list');
      });

      it('should should not delete the Axetype and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
