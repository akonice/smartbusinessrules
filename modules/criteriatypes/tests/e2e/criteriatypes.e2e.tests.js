'use strict';

describe('Criteriatypes E2E Tests:', function () {
  describe('Test Criteriatypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/criteriatypes');
      expect(element.all(by.repeater('criteriatype in criteriatypes')).count()).toEqual(0);
    });
  });
});
