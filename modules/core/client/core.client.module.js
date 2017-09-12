(function (app) {
  'use strict';

  app.registerModule('core');
  app.registerModule('core.routes', ['ui.router']);
  app.registerModule('core.admin', ['core']);
  app.registerModule('core.config', ['core']);
  app.registerModule('core.admin.routes', ['ui.router']);
  app.registerModule('core.config.routes', ['ui.router']);
}(ApplicationConfiguration));
