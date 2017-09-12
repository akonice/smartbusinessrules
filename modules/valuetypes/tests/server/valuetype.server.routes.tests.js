'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Valuetype = mongoose.model('Valuetype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  valuetype;

/**
 * Valuetype routes tests
 */
describe('Valuetype CRUD tests', function () {

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

    // Save a user to the test db and create new Valuetype
    user.save(function () {
      valuetype = {
        name: 'Valuetype name'
      };

      done();
    });
  });

  it('should be able to save a Valuetype if logged in', function (done) {
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

        // Save a new Valuetype
        agent.post('/api/valuetypes')
          .send(valuetype)
          .expect(200)
          .end(function (valuetypeSaveErr, valuetypeSaveRes) {
            // Handle Valuetype save error
            if (valuetypeSaveErr) {
              return done(valuetypeSaveErr);
            }

            // Get a list of Valuetypes
            agent.get('/api/valuetypes')
              .end(function (valuetypesGetErr, valuetypesGetRes) {
                // Handle Valuetypes save error
                if (valuetypesGetErr) {
                  return done(valuetypesGetErr);
                }

                // Get Valuetypes list
                var valuetypes = valuetypesGetRes.body;

                // Set assertions
                (valuetypes[0].user._id).should.equal(userId);
                (valuetypes[0].name).should.match('Valuetype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Valuetype if not logged in', function (done) {
    agent.post('/api/valuetypes')
      .send(valuetype)
      .expect(403)
      .end(function (valuetypeSaveErr, valuetypeSaveRes) {
        // Call the assertion callback
        done(valuetypeSaveErr);
      });
  });

  it('should not be able to save an Valuetype if no name is provided', function (done) {
    // Invalidate name field
    valuetype.name = '';

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

        // Save a new Valuetype
        agent.post('/api/valuetypes')
          .send(valuetype)
          .expect(400)
          .end(function (valuetypeSaveErr, valuetypeSaveRes) {
            // Set message assertion
            (valuetypeSaveRes.body.message).should.match('Please fill Valuetype name');

            // Handle Valuetype save error
            done(valuetypeSaveErr);
          });
      });
  });

  it('should be able to update an Valuetype if signed in', function (done) {
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

        // Save a new Valuetype
        agent.post('/api/valuetypes')
          .send(valuetype)
          .expect(200)
          .end(function (valuetypeSaveErr, valuetypeSaveRes) {
            // Handle Valuetype save error
            if (valuetypeSaveErr) {
              return done(valuetypeSaveErr);
            }

            // Update Valuetype name
            valuetype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Valuetype
            agent.put('/api/valuetypes/' + valuetypeSaveRes.body._id)
              .send(valuetype)
              .expect(200)
              .end(function (valuetypeUpdateErr, valuetypeUpdateRes) {
                // Handle Valuetype update error
                if (valuetypeUpdateErr) {
                  return done(valuetypeUpdateErr);
                }

                // Set assertions
                (valuetypeUpdateRes.body._id).should.equal(valuetypeSaveRes.body._id);
                (valuetypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Valuetypes if not signed in', function (done) {
    // Create new Valuetype model instance
    var valuetypeObj = new Valuetype(valuetype);

    // Save the valuetype
    valuetypeObj.save(function () {
      // Request Valuetypes
      request(app).get('/api/valuetypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Valuetype if not signed in', function (done) {
    // Create new Valuetype model instance
    var valuetypeObj = new Valuetype(valuetype);

    // Save the Valuetype
    valuetypeObj.save(function () {
      request(app).get('/api/valuetypes/' + valuetypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', valuetype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Valuetype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/valuetypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Valuetype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Valuetype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Valuetype
    request(app).get('/api/valuetypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Valuetype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Valuetype if signed in', function (done) {
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

        // Save a new Valuetype
        agent.post('/api/valuetypes')
          .send(valuetype)
          .expect(200)
          .end(function (valuetypeSaveErr, valuetypeSaveRes) {
            // Handle Valuetype save error
            if (valuetypeSaveErr) {
              return done(valuetypeSaveErr);
            }

            // Delete an existing Valuetype
            agent.delete('/api/valuetypes/' + valuetypeSaveRes.body._id)
              .send(valuetype)
              .expect(200)
              .end(function (valuetypeDeleteErr, valuetypeDeleteRes) {
                // Handle valuetype error error
                if (valuetypeDeleteErr) {
                  return done(valuetypeDeleteErr);
                }

                // Set assertions
                (valuetypeDeleteRes.body._id).should.equal(valuetypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Valuetype if not signed in', function (done) {
    // Set Valuetype user
    valuetype.user = user;

    // Create new Valuetype model instance
    var valuetypeObj = new Valuetype(valuetype);

    // Save the Valuetype
    valuetypeObj.save(function () {
      // Try deleting Valuetype
      request(app).delete('/api/valuetypes/' + valuetypeObj._id)
        .expect(403)
        .end(function (valuetypeDeleteErr, valuetypeDeleteRes) {
          // Set message assertion
          (valuetypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Valuetype error error
          done(valuetypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Valuetype that has an orphaned user reference', function (done) {
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

          // Save a new Valuetype
          agent.post('/api/valuetypes')
            .send(valuetype)
            .expect(200)
            .end(function (valuetypeSaveErr, valuetypeSaveRes) {
              // Handle Valuetype save error
              if (valuetypeSaveErr) {
                return done(valuetypeSaveErr);
              }

              // Set assertions on new Valuetype
              (valuetypeSaveRes.body.name).should.equal(valuetype.name);
              should.exist(valuetypeSaveRes.body.user);
              should.equal(valuetypeSaveRes.body.user._id, orphanId);

              // force the Valuetype to have an orphaned user reference
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

                    // Get the Valuetype
                    agent.get('/api/valuetypes/' + valuetypeSaveRes.body._id)
                      .expect(200)
                      .end(function (valuetypeInfoErr, valuetypeInfoRes) {
                        // Handle Valuetype error
                        if (valuetypeInfoErr) {
                          return done(valuetypeInfoErr);
                        }

                        // Set assertions
                        (valuetypeInfoRes.body._id).should.equal(valuetypeSaveRes.body._id);
                        (valuetypeInfoRes.body.name).should.equal(valuetype.name);
                        should.equal(valuetypeInfoRes.body.user, undefined);

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
      Valuetype.remove().exec(done);
    });
  });
});
