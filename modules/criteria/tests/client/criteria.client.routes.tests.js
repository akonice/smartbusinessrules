(function () {
  'use strict';

  describe('Criteria Route Tests', function () {
    // Initialize global variables
    var $scope,
      CriteriaService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CriteriaService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CriteriaService = _CriteriaService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('criteria');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/criteria');
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
          CriteriaController,
          mockCriterium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('criteria.view');
          $templateCache.put('modules/criteria/client/views/view-criterium.client.view.html', '');

          // create mock Criterium
          mockCriterium = new CriteriaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Criterium Name'
          });

          // Initialize Controller
          CriteriaController = $controller('CriteriaController as vm', {
            $scope: $scope,
            criteriumResolve: mockCriterium
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:criteriumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.criteriumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            criteriumId: 1
          })).toEqual('/criteria/1');
        }));

        it('should attach an Criterium to the controller scope', function () {
          expect($scope.vm.criterium._id).toBe(mockCriterium._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/criteria/client/views/view-criterium.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CriteriaController,
          mockCriterium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('criteria.create');
          $templateCache.put('modules/criteria/client/views/form-criterium.client.view.html', '');

          // create mock Criterium
          mockCriterium = new CriteriaService();

          // Initialize Controller
          CriteriaController = $controller('CriteriaController as vm', {
            $scope: $scope,
            criteriumResolve: mockCriterium
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.criteriumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/criteria/create');
        }));

        it('should attach an Criterium to the controller scope', function () {
          expect($scope.vm.criterium._id).toBe(mockCriterium._id);
          expect($scope.vm.criterium._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/criteria/client/views/form-criterium.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CriteriaController,
          mockCriterium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('criteria.edit');
          $templateCache.put('modules/criteria/client/views/form-criterium.client.view.html', '');

          // create mock Criterium
          mockCriterium = new CriteriaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Criterium Name'
          });

          // Initialize Controller
          CriteriaController = $controller('CriteriaController as vm', {
            $scope: $scope,
            criteriumResolve: mockCriterium
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:criteriumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.criteriumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            criteriumId: 1
          })).toEqual('/criteria/1/edit');
        }));

        it('should attach an Criterium to the controller scope', function () {
          expect($scope.vm.criterium._id).toBe(mockCriterium._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/criteria/client/views/form-criterium.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
