(function () {
  'use strict';

  describe('Valuetypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ValuetypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ValuetypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ValuetypesService = _ValuetypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('valuetypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/valuetypes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ValuetypesController,
          mockValuetype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('valuetypes.view');
          $templateCache.put('modules/valuetypes/client/views/view-valuetype.client.view.html', '');

          // create mock Valuetype
          mockValuetype = new ValuetypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Valuetype Name'
          });

          // Initialize Controller
          ValuetypesController = $controller('ValuetypesController as vm', {
            $scope: $scope,
            valuetypeResolve: mockValuetype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:valuetypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.valuetypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            valuetypeId: 1
          })).toEqual('/valuetypes/1');
        }));

        it('should attach an Valuetype to the controller scope', function () {
          expect($scope.vm.valuetype._id).toBe(mockValuetype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/valuetypes/client/views/view-valuetype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ValuetypesController,
          mockValuetype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('valuetypes.create');
          $templateCache.put('modules/valuetypes/client/views/form-valuetype.client.view.html', '');

          // create mock Valuetype
          mockValuetype = new ValuetypesService();

          // Initialize Controller
          ValuetypesController = $controller('ValuetypesController as vm', {
            $scope: $scope,
            valuetypeResolve: mockValuetype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.valuetypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/valuetypes/create');
        }));

        it('should attach an Valuetype to the controller scope', function () {
          expect($scope.vm.valuetype._id).toBe(mockValuetype._id);
          expect($scope.vm.valuetype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/valuetypes/client/views/form-valuetype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ValuetypesController,
          mockValuetype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('valuetypes.edit');
          $templateCache.put('modules/valuetypes/client/views/form-valuetype.client.view.html', '');

          // create mock Valuetype
          mockValuetype = new ValuetypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Valuetype Name'
          });

          // Initialize Controller
          ValuetypesController = $controller('ValuetypesController as vm', {
            $scope: $scope,
            valuetypeResolve: mockValuetype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:valuetypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.valuetypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            valuetypeId: 1
          })).toEqual('/valuetypes/1/edit');
        }));

        it('should attach an Valuetype to the controller scope', function () {
          expect($scope.vm.valuetype._id).toBe(mockValuetype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/valuetypes/client/views/form-valuetype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
