'use strict';

describe('Viewtypes E2E Tests:', function () {
  describe('Test Viewtypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/viewtypes');
      expect(element.all(by.repeater('viewtype in viewtypes')).count()).toEqual(0);
    });
  });
});
