'use strict';

describe('Apitypes E2E Tests:', function () {
  describe('Test Apitypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/apitypes');
      expect(element.all(by.repeater('apitype in apitypes')).count()).toEqual(0);
    });
  });
});
