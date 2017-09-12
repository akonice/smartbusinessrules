'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Apitype = mongoose.model('Apitype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  apitype;

/**
 * Apitype routes tests
 */
describe('Apitype CRUD tests', function () {

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

    // Save a user to the test db and create new Apitype
    user.save(function () {
      apitype = {
        name: 'Apitype name'
      };

      done();
    });
  });

  it('should be able to save a Apitype if logged in', function (done) {
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

        // Save a new Apitype
        agent.post('/api/apitypes')
          .send(apitype)
          .expect(200)
          .end(function (apitypeSaveErr, apitypeSaveRes) {
            // Handle Apitype save error
            if (apitypeSaveErr) {
              return done(apitypeSaveErr);
            }

            // Get a list of Apitypes
            agent.get('/api/apitypes')
              .end(function (apitypesGetErr, apitypesGetRes) {
                // Handle Apitypes save error
                if (apitypesGetErr) {
                  return done(apitypesGetErr);
                }

                // Get Apitypes list
                var apitypes = apitypesGetRes.body;

                // Set assertions
                (apitypes[0].user._id).should.equal(userId);
                (apitypes[0].name).should.match('Apitype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Apitype if not logged in', function (done) {
    agent.post('/api/apitypes')
      .send(apitype)
      .expect(403)
      .end(function (apitypeSaveErr, apitypeSaveRes) {
        // Call the assertion callback
        done(apitypeSaveErr);
      });
  });

  it('should not be able to save an Apitype if no name is provided', function (done) {
    // Invalidate name field
    apitype.name = '';

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

        // Save a new Apitype
        agent.post('/api/apitypes')
          .send(apitype)
          .expect(400)
          .end(function (apitypeSaveErr, apitypeSaveRes) {
            // Set message assertion
            (apitypeSaveRes.body.message).should.match('Please fill Apitype name');

            // Handle Apitype save error
            done(apitypeSaveErr);
          });
      });
  });

  it('should be able to update an Apitype if signed in', function (done) {
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

        // Save a new Apitype
        agent.post('/api/apitypes')
          .send(apitype)
          .expect(200)
          .end(function (apitypeSaveErr, apitypeSaveRes) {
            // Handle Apitype save error
            if (apitypeSaveErr) {
              return done(apitypeSaveErr);
            }

            // Update Apitype name
            apitype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Apitype
            agent.put('/api/apitypes/' + apitypeSaveRes.body._id)
              .send(apitype)
              .expect(200)
              .end(function (apitypeUpdateErr, apitypeUpdateRes) {
                // Handle Apitype update error
                if (apitypeUpdateErr) {
                  return done(apitypeUpdateErr);
                }

                // Set assertions
                (apitypeUpdateRes.body._id).should.equal(apitypeSaveRes.body._id);
                (apitypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Apitypes if not signed in', function (done) {
    // Create new Apitype model instance
    var apitypeObj = new Apitype(apitype);

    // Save the apitype
    apitypeObj.save(function () {
      // Request Apitypes
      request(app).get('/api/apitypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Apitype if not signed in', function (done) {
    // Create new Apitype model instance
    var apitypeObj = new Apitype(apitype);

    // Save the Apitype
    apitypeObj.save(function () {
      request(app).get('/api/apitypes/' + apitypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', apitype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Apitype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/apitypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Apitype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Apitype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Apitype
    request(app).get('/api/apitypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Apitype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Apitype if signed in', function (done) {
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

        // Save a new Apitype
        agent.post('/api/apitypes')
          .send(apitype)
          .expect(200)
          .end(function (apitypeSaveErr, apitypeSaveRes) {
            // Handle Apitype save error
            if (apitypeSaveErr) {
              return done(apitypeSaveErr);
            }

            // Delete an existing Apitype
            agent.delete('/api/apitypes/' + apitypeSaveRes.body._id)
              .send(apitype)
              .expect(200)
              .end(function (apitypeDeleteErr, apitypeDeleteRes) {
                // Handle apitype error error
                if (apitypeDeleteErr) {
                  return done(apitypeDeleteErr);
                }

                // Set assertions
                (apitypeDeleteRes.body._id).should.equal(apitypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Apitype if not signed in', function (done) {
    // Set Apitype user
    apitype.user = user;

    // Create new Apitype model instance
    var apitypeObj = new Apitype(apitype);

    // Save the Apitype
    apitypeObj.save(function () {
      // Try deleting Apitype
      request(app).delete('/api/apitypes/' + apitypeObj._id)
        .expect(403)
        .end(function (apitypeDeleteErr, apitypeDeleteRes) {
          // Set message assertion
          (apitypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Apitype error error
          done(apitypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Apitype that has an orphaned user reference', function (done) {
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

          // Save a new Apitype
          agent.post('/api/apitypes')
            .send(apitype)
            .expect(200)
            .end(function (apitypeSaveErr, apitypeSaveRes) {
              // Handle Apitype save error
              if (apitypeSaveErr) {
                return done(apitypeSaveErr);
              }

              // Set assertions on new Apitype
              (apitypeSaveRes.body.name).should.equal(apitype.name);
              should.exist(apitypeSaveRes.body.user);
              should.equal(apitypeSaveRes.body.user._id, orphanId);

              // force the Apitype to have an orphaned user reference
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

                    // Get the Apitype
                    agent.get('/api/apitypes/' + apitypeSaveRes.body._id)
                      .expect(200)
                      .end(function (apitypeInfoErr, apitypeInfoRes) {
                        // Handle Apitype error
                        if (apitypeInfoErr) {
                          return done(apitypeInfoErr);
                        }

                        // Set assertions
                        (apitypeInfoRes.body._id).should.equal(apitypeSaveRes.body._id);
                        (apitypeInfoRes.body.name).should.equal(apitype.name);
                        should.equal(apitypeInfoRes.body.user, undefined);

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
      Apitype.remove().exec(done);
    });
  });
});
