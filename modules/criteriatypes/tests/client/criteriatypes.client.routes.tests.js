(function () {
  'use strict';

  describe('Criteriatypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      CriteriatypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CriteriatypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CriteriatypesService = _CriteriatypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('criteriatypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/criteriatypes');
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
          CriteriatypesController,
          mockCriteriatype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('criteriatypes.view');
          $templateCache.put('modules/criteriatypes/client/views/view-criteriatype.client.view.html', '');

          // create mock Criteriatype
          mockCriteriatype = new CriteriatypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Criteriatype Name'
          });

          // Initialize Controller
          CriteriatypesController = $controller('CriteriatypesController as vm', {
            $scope: $scope,
            criteriatypeResolve: mockCriteriatype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:criteriatypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.criteriatypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            criteriatypeId: 1
          })).toEqual('/criteriatypes/1');
        }));

        it('should attach an Criteriatype to the controller scope', function () {
          expect($scope.vm.criteriatype._id).toBe(mockCriteriatype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/criteriatypes/client/views/view-criteriatype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CriteriatypesController,
          mockCriteriatype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('criteriatypes.create');
          $templateCache.put('modules/criteriatypes/client/views/form-criteriatype.client.view.html', '');

          // create mock Criteriatype
          mockCriteriatype = new CriteriatypesService();

          // Initialize Controller
          CriteriatypesController = $controller('CriteriatypesController as vm', {
            $scope: $scope,
            criteriatypeResolve: mockCriteriatype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.criteriatypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/criteriatypes/create');
        }));

        it('should attach an Criteriatype to the controller scope', function () {
          expect($scope.vm.criteriatype._id).toBe(mockCriteriatype._id);
          expect($scope.vm.criteriatype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/criteriatypes/client/views/form-criteriatype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CriteriatypesController,
          mockCriteriatype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('criteriatypes.edit');
          $templateCache.put('modules/criteriatypes/client/views/form-criteriatype.client.view.html', '');

          // create mock Criteriatype
          mockCriteriatype = new CriteriatypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Criteriatype Name'
          });

          // Initialize Controller
          CriteriatypesController = $controller('CriteriatypesController as vm', {
            $scope: $scope,
            criteriatypeResolve: mockCriteriatype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:criteriatypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.criteriatypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            criteriatypeId: 1
          })).toEqual('/criteriatypes/1/edit');
        }));

        it('should attach an Criteriatype to the controller scope', function () {
          expect($scope.vm.criteriatype._id).toBe(mockCriteriatype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/criteriatypes/client/views/form-criteriatype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
