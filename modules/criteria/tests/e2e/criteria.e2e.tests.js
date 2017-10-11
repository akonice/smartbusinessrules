'use strict';

describe('Criteria E2E Tests:', function () {
  describe('Test Criteria page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/criteria');
      expect(element.all(by.repeater('criterium in criteria')).count()).toEqual(0);
    });
  });
});
