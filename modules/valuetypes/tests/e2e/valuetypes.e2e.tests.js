'use strict';

describe('Valuetypes E2E Tests:', function () {
  describe('Test Valuetypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/valuetypes');
      expect(element.all(by.repeater('valuetype in valuetypes')).count()).toEqual(0);
    });
  });
});
