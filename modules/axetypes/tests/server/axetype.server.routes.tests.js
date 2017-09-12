'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Axetype = mongoose.model('Axetype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  axetype;

/**
 * Axetype routes tests
 */
describe('Axetype CRUD tests', function () {

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

    // Save a user to the test db and create new Axetype
    user.save(function () {
      axetype = {
        name: 'Axetype name'
      };

      done();
    });
  });

  it('should be able to save a Axetype if logged in', function (done) {
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

        // Save a new Axetype
        agent.post('/api/axetypes')
          .send(axetype)
          .expect(200)
          .end(function (axetypeSaveErr, axetypeSaveRes) {
            // Handle Axetype save error
            if (axetypeSaveErr) {
              return done(axetypeSaveErr);
            }

            // Get a list of Axetypes
            agent.get('/api/axetypes')
              .end(function (axetypesGetErr, axetypesGetRes) {
                // Handle Axetypes save error
                if (axetypesGetErr) {
                  return done(axetypesGetErr);
                }

                // Get Axetypes list
                var axetypes = axetypesGetRes.body;

                // Set assertions
                (axetypes[0].user._id).should.equal(userId);
                (axetypes[0].name).should.match('Axetype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Axetype if not logged in', function (done) {
    agent.post('/api/axetypes')
      .send(axetype)
      .expect(403)
      .end(function (axetypeSaveErr, axetypeSaveRes) {
        // Call the assertion callback
        done(axetypeSaveErr);
      });
  });

  it('should not be able to save an Axetype if no name is provided', function (done) {
    // Invalidate name field
    axetype.name = '';

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

        // Save a new Axetype
        agent.post('/api/axetypes')
          .send(axetype)
          .expect(400)
          .end(function (axetypeSaveErr, axetypeSaveRes) {
            // Set message assertion
            (axetypeSaveRes.body.message).should.match('Please fill Axetype name');

            // Handle Axetype save error
            done(axetypeSaveErr);
          });
      });
  });

  it('should be able to update an Axetype if signed in', function (done) {
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

        // Save a new Axetype
        agent.post('/api/axetypes')
          .send(axetype)
          .expect(200)
          .end(function (axetypeSaveErr, axetypeSaveRes) {
            // Handle Axetype save error
            if (axetypeSaveErr) {
              return done(axetypeSaveErr);
            }

            // Update Axetype name
            axetype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Axetype
            agent.put('/api/axetypes/' + axetypeSaveRes.body._id)
              .send(axetype)
              .expect(200)
              .end(function (axetypeUpdateErr, axetypeUpdateRes) {
                // Handle Axetype update error
                if (axetypeUpdateErr) {
                  return done(axetypeUpdateErr);
                }

                // Set assertions
                (axetypeUpdateRes.body._id).should.equal(axetypeSaveRes.body._id);
                (axetypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Axetypes if not signed in', function (done) {
    // Create new Axetype model instance
    var axetypeObj = new Axetype(axetype);

    // Save the axetype
    axetypeObj.save(function () {
      // Request Axetypes
      request(app).get('/api/axetypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Axetype if not signed in', function (done) {
    // Create new Axetype model instance
    var axetypeObj = new Axetype(axetype);

    // Save the Axetype
    axetypeObj.save(function () {
      request(app).get('/api/axetypes/' + axetypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', axetype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Axetype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/axetypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Axetype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Axetype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Axetype
    request(app).get('/api/axetypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Axetype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Axetype if signed in', function (done) {
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

        // Save a new Axetype
        agent.post('/api/axetypes')
          .send(axetype)
          .expect(200)
          .end(function (axetypeSaveErr, axetypeSaveRes) {
            // Handle Axetype save error
            if (axetypeSaveErr) {
              return done(axetypeSaveErr);
            }

            // Delete an existing Axetype
            agent.delete('/api/axetypes/' + axetypeSaveRes.body._id)
              .send(axetype)
              .expect(200)
              .end(function (axetypeDeleteErr, axetypeDeleteRes) {
                // Handle axetype error error
                if (axetypeDeleteErr) {
                  return done(axetypeDeleteErr);
                }

                // Set assertions
                (axetypeDeleteRes.body._id).should.equal(axetypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Axetype if not signed in', function (done) {
    // Set Axetype user
    axetype.user = user;

    // Create new Axetype model instance
    var axetypeObj = new Axetype(axetype);

    // Save the Axetype
    axetypeObj.save(function () {
      // Try deleting Axetype
      request(app).delete('/api/axetypes/' + axetypeObj._id)
        .expect(403)
        .end(function (axetypeDeleteErr, axetypeDeleteRes) {
          // Set message assertion
          (axetypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Axetype error error
          done(axetypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Axetype that has an orphaned user reference', function (done) {
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

          // Save a new Axetype
          agent.post('/api/axetypes')
            .send(axetype)
            .expect(200)
            .end(function (axetypeSaveErr, axetypeSaveRes) {
              // Handle Axetype save error
              if (axetypeSaveErr) {
                return done(axetypeSaveErr);
              }

              // Set assertions on new Axetype
              (axetypeSaveRes.body.name).should.equal(axetype.name);
              should.exist(axetypeSaveRes.body.user);
              should.equal(axetypeSaveRes.body.user._id, orphanId);

              // force the Axetype to have an orphaned user reference
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

                    // Get the Axetype
                    agent.get('/api/axetypes/' + axetypeSaveRes.body._id)
                      .expect(200)
                      .end(function (axetypeInfoErr, axetypeInfoRes) {
                        // Handle Axetype error
                        if (axetypeInfoErr) {
                          return done(axetypeInfoErr);
                        }

                        // Set assertions
                        (axetypeInfoRes.body._id).should.equal(axetypeSaveRes.body._id);
                        (axetypeInfoRes.body.name).should.equal(axetype.name);
                        should.equal(axetypeInfoRes.body.user, undefined);

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
      Axetype.remove().exec(done);
    });
  });
});
