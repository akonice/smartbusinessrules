'use strict';

describe('Rulecriteria E2E Tests:', function () {
  describe('Test Rulecriteria page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/rulecriteria');
      expect(element.all(by.repeater('rulecriterium in rulecriteria')).count()).toEqual(0);
    });
  });
});
