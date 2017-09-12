'use strict';

describe('Axetypes E2E Tests:', function () {
  describe('Test Axetypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/axetypes');
      expect(element.all(by.repeater('axetype in axetypes')).count()).toEqual(0);
    });
  });
});
