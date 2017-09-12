(function () {
  'use strict';

  describe('Viewtypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ViewtypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ViewtypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ViewtypesService = _ViewtypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('viewtypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/viewtypes');
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
          ViewtypesController,
          mockViewtype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('viewtypes.view');
          $templateCache.put('modules/viewtypes/client/views/view-viewtype.client.view.html', '');

          // create mock Viewtype
          mockViewtype = new ViewtypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Viewtype Name'
          });

          // Initialize Controller
          ViewtypesController = $controller('ViewtypesController as vm', {
            $scope: $scope,
            viewtypeResolve: mockViewtype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:viewtypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.viewtypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            viewtypeId: 1
          })).toEqual('/viewtypes/1');
        }));

        it('should attach an Viewtype to the controller scope', function () {
          expect($scope.vm.viewtype._id).toBe(mockViewtype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/viewtypes/client/views/view-viewtype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ViewtypesController,
          mockViewtype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('viewtypes.create');
          $templateCache.put('modules/viewtypes/client/views/form-viewtype.client.view.html', '');

          // create mock Viewtype
          mockViewtype = new ViewtypesService();

          // Initialize Controller
          ViewtypesController = $controller('ViewtypesController as vm', {
            $scope: $scope,
            viewtypeResolve: mockViewtype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.viewtypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/viewtypes/create');
        }));

        it('should attach an Viewtype to the controller scope', function () {
          expect($scope.vm.viewtype._id).toBe(mockViewtype._id);
          expect($scope.vm.viewtype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/viewtypes/client/views/form-viewtype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ViewtypesController,
          mockViewtype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('viewtypes.edit');
          $templateCache.put('modules/viewtypes/client/views/form-viewtype.client.view.html', '');

          // create mock Viewtype
          mockViewtype = new ViewtypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Viewtype Name'
          });

          // Initialize Controller
          ViewtypesController = $controller('ViewtypesController as vm', {
            $scope: $scope,
            viewtypeResolve: mockViewtype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:viewtypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.viewtypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            viewtypeId: 1
          })).toEqual('/viewtypes/1/edit');
        }));

        it('should attach an Viewtype to the controller scope', function () {
          expect($scope.vm.viewtype._id).toBe(mockViewtype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/viewtypes/client/views/form-viewtype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
