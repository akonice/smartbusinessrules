'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Viewtype = mongoose.model('Viewtype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  viewtype;

/**
 * Viewtype routes tests
 */
describe('Viewtype CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Viewtype
    user.save(function () {
      viewtype = {
        name: 'Viewtype name'
      };

      done();
    });
  });

  it('should be able to save a Viewtype if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Viewtype
        agent.post('/api/viewtypes')
          .send(viewtype)
          .expect(200)
          .end(function (viewtypeSaveErr, viewtypeSaveRes) {
            // Handle Viewtype save error
            if (viewtypeSaveErr) {
              return done(viewtypeSaveErr);
            }

            // Get a list of Viewtypes
            agent.get('/api/viewtypes')
              .end(function (viewtypesGetErr, viewtypesGetRes) {
                // Handle Viewtypes save error
                if (viewtypesGetErr) {
                  return done(viewtypesGetErr);
                }

                // Get Viewtypes list
                var viewtypes = viewtypesGetRes.body;

                // Set assertions
                (viewtypes[0].user._id).should.equal(userId);
                (viewtypes[0].name).should.match('Viewtype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Viewtype if not logged in', function (done) {
    agent.post('/api/viewtypes')
      .send(viewtype)
      .expect(403)
      .end(function (viewtypeSaveErr, viewtypeSaveRes) {
        // Call the assertion callback
        done(viewtypeSaveErr);
      });
  });

  it('should not be able to save an Viewtype if no name is provided', function (done) {
    // Invalidate name field
    viewtype.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Viewtype
        agent.post('/api/viewtypes')
          .send(viewtype)
          .expect(400)
          .end(function (viewtypeSaveErr, viewtypeSaveRes) {
            // Set message assertion
            (viewtypeSaveRes.body.message).should.match('Please fill Viewtype name');

            // Handle Viewtype save error
            done(viewtypeSaveErr);
          });
      });
  });

  it('should be able to update an Viewtype if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Viewtype
        agent.post('/api/viewtypes')
          .send(viewtype)
          .expect(200)
          .end(function (viewtypeSaveErr, viewtypeSaveRes) {
            // Handle Viewtype save error
            if (viewtypeSaveErr) {
              return done(viewtypeSaveErr);
            }

            // Update Viewtype name
            viewtype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Viewtype
            agent.put('/api/viewtypes/' + viewtypeSaveRes.body._id)
              .send(viewtype)
              .expect(200)
              .end(function (viewtypeUpdateErr, viewtypeUpdateRes) {
                // Handle Viewtype update error
                if (viewtypeUpdateErr) {
                  return done(viewtypeUpdateErr);
                }

                // Set assertions
                (viewtypeUpdateRes.body._id).should.equal(viewtypeSaveRes.body._id);
                (viewtypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Viewtypes if not signed in', function (done) {
    // Create new Viewtype model instance
    var viewtypeObj = new Viewtype(viewtype);

    // Save the viewtype
    viewtypeObj.save(function () {
      // Request Viewtypes
      request(app).get('/api/viewtypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Viewtype if not signed in', function (done) {
    // Create new Viewtype model instance
    var viewtypeObj = new Viewtype(viewtype);

    // Save the Viewtype
    viewtypeObj.save(function () {
      request(app).get('/api/viewtypes/' + viewtypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', viewtype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Viewtype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/viewtypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Viewtype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Viewtype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Viewtype
    request(app).get('/api/viewtypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Viewtype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Viewtype if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Viewtype
        agent.post('/api/viewtypes')
          .send(viewtype)
          .expect(200)
          .end(function (viewtypeSaveErr, viewtypeSaveRes) {
            // Handle Viewtype save error
            if (viewtypeSaveErr) {
              return done(viewtypeSaveErr);
            }

            // Delete an existing Viewtype
            agent.delete('/api/viewtypes/' + viewtypeSaveRes.body._id)
              .send(viewtype)
              .expect(200)
              .end(function (viewtypeDeleteErr, viewtypeDeleteRes) {
                // Handle viewtype error error
                if (viewtypeDeleteErr) {
                  return done(viewtypeDeleteErr);
                }

                // Set assertions
                (viewtypeDeleteRes.body._id).should.equal(viewtypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Viewtype if not signed in', function (done) {
    // Set Viewtype user
    viewtype.user = user;

    // Create new Viewtype model instance
    var viewtypeObj = new Viewtype(viewtype);

    // Save the Viewtype
    viewtypeObj.save(function () {
      // Try deleting Viewtype
      request(app).delete('/api/viewtypes/' + viewtypeObj._id)
        .expect(403)
        .end(function (viewtypeDeleteErr, viewtypeDeleteRes) {
          // Set message assertion
          (viewtypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Viewtype error error
          done(viewtypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Viewtype that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Viewtype
          agent.post('/api/viewtypes')
            .send(viewtype)
            .expect(200)
            .end(function (viewtypeSaveErr, viewtypeSaveRes) {
              // Handle Viewtype save error
              if (viewtypeSaveErr) {
                return done(viewtypeSaveErr);
              }

              // Set assertions on new Viewtype
              (viewtypeSaveRes.body.name).should.equal(viewtype.name);
              should.exist(viewtypeSaveRes.body.user);
              should.equal(viewtypeSaveRes.body.user._id, orphanId);

              // force the Viewtype to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Viewtype
                    agent.get('/api/viewtypes/' + viewtypeSaveRes.body._id)
                      .expect(200)
                      .end(function (viewtypeInfoErr, viewtypeInfoRes) {
                        // Handle Viewtype error
                        if (viewtypeInfoErr) {
                          return done(viewtypeInfoErr);
                        }

                        // Set assertions
                        (viewtypeInfoRes.body._id).should.equal(viewtypeSaveRes.body._id);
                        (viewtypeInfoRes.body.name).should.equal(viewtype.name);
                        should.equal(viewtypeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Viewtype.remove().exec(done);
    });
  });
});
