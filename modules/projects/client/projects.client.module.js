(function (app) {
  'use strict';

  app.registerModule('projects',['ui.router', 'core.routes', 'categories.services']);
  app.registerModule('categories.services');
  //   app.registerModule('users.admin.routes', ['ui.router', 'core.routes', 'users.admin.services']);

/*
  app.registerModule('users.admin.routes', ['ui.router', 'core.routes', 'users.admin.services']);
  app.registerModule('users.admin.services');
  app.registerModule('users.routes', ['ui.router', 'core.routes']);
*/

}(ApplicationConfiguration));
