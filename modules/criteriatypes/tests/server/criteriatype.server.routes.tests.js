'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Criteriatype = mongoose.model('Criteriatype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  criteriatype;

/**
 * Criteriatype routes tests
 */
describe('Criteriatype CRUD tests', function () {

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

    // Save a user to the test db and create new Criteriatype
    user.save(function () {
      criteriatype = {
        name: 'Criteriatype name'
      };

      done();
    });
  });

  it('should be able to save a Criteriatype if logged in', function (done) {
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

        // Save a new Criteriatype
        agent.post('/api/criteriatypes')
          .send(criteriatype)
          .expect(200)
          .end(function (criteriatypeSaveErr, criteriatypeSaveRes) {
            // Handle Criteriatype save error
            if (criteriatypeSaveErr) {
              return done(criteriatypeSaveErr);
            }

            // Get a list of Criteriatypes
            agent.get('/api/criteriatypes')
              .end(function (criteriatypesGetErr, criteriatypesGetRes) {
                // Handle Criteriatypes save error
                if (criteriatypesGetErr) {
                  return done(criteriatypesGetErr);
                }

                // Get Criteriatypes list
                var criteriatypes = criteriatypesGetRes.body;

                // Set assertions
                (criteriatypes[0].user._id).should.equal(userId);
                (criteriatypes[0].name).should.match('Criteriatype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Criteriatype if not logged in', function (done) {
    agent.post('/api/criteriatypes')
      .send(criteriatype)
      .expect(403)
      .end(function (criteriatypeSaveErr, criteriatypeSaveRes) {
        // Call the assertion callback
        done(criteriatypeSaveErr);
      });
  });

  it('should not be able to save an Criteriatype if no name is provided', function (done) {
    // Invalidate name field
    criteriatype.name = '';

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

        // Save a new Criteriatype
        agent.post('/api/criteriatypes')
          .send(criteriatype)
          .expect(400)
          .end(function (criteriatypeSaveErr, criteriatypeSaveRes) {
            // Set message assertion
            (criteriatypeSaveRes.body.message).should.match('Please fill Criteriatype name');

            // Handle Criteriatype save error
            done(criteriatypeSaveErr);
          });
      });
  });

  it('should be able to update an Criteriatype if signed in', function (done) {
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

        // Save a new Criteriatype
        agent.post('/api/criteriatypes')
          .send(criteriatype)
          .expect(200)
          .end(function (criteriatypeSaveErr, criteriatypeSaveRes) {
            // Handle Criteriatype save error
            if (criteriatypeSaveErr) {
              return done(criteriatypeSaveErr);
            }

            // Update Criteriatype name
            criteriatype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Criteriatype
            agent.put('/api/criteriatypes/' + criteriatypeSaveRes.body._id)
              .send(criteriatype)
              .expect(200)
              .end(function (criteriatypeUpdateErr, criteriatypeUpdateRes) {
                // Handle Criteriatype update error
                if (criteriatypeUpdateErr) {
                  return done(criteriatypeUpdateErr);
                }

                // Set assertions
                (criteriatypeUpdateRes.body._id).should.equal(criteriatypeSaveRes.body._id);
                (criteriatypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Criteriatypes if not signed in', function (done) {
    // Create new Criteriatype model instance
    var criteriatypeObj = new Criteriatype(criteriatype);

    // Save the criteriatype
    criteriatypeObj.save(function () {
      // Request Criteriatypes
      request(app).get('/api/criteriatypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Criteriatype if not signed in', function (done) {
    // Create new Criteriatype model instance
    var criteriatypeObj = new Criteriatype(criteriatype);

    // Save the Criteriatype
    criteriatypeObj.save(function () {
      request(app).get('/api/criteriatypes/' + criteriatypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', criteriatype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Criteriatype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/criteriatypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Criteriatype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Criteriatype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Criteriatype
    request(app).get('/api/criteriatypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Criteriatype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Criteriatype if signed in', function (done) {
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

        // Save a new Criteriatype
        agent.post('/api/criteriatypes')
          .send(criteriatype)
          .expect(200)
          .end(function (criteriatypeSaveErr, criteriatypeSaveRes) {
            // Handle Criteriatype save error
            if (criteriatypeSaveErr) {
              return done(criteriatypeSaveErr);
            }

            // Delete an existing Criteriatype
            agent.delete('/api/criteriatypes/' + criteriatypeSaveRes.body._id)
              .send(criteriatype)
              .expect(200)
              .end(function (criteriatypeDeleteErr, criteriatypeDeleteRes) {
                // Handle criteriatype error error
                if (criteriatypeDeleteErr) {
                  return done(criteriatypeDeleteErr);
                }

                // Set assertions
                (criteriatypeDeleteRes.body._id).should.equal(criteriatypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Criteriatype if not signed in', function (done) {
    // Set Criteriatype user
    criteriatype.user = user;

    // Create new Criteriatype model instance
    var criteriatypeObj = new Criteriatype(criteriatype);

    // Save the Criteriatype
    criteriatypeObj.save(function () {
      // Try deleting Criteriatype
      request(app).delete('/api/criteriatypes/' + criteriatypeObj._id)
        .expect(403)
        .end(function (criteriatypeDeleteErr, criteriatypeDeleteRes) {
          // Set message assertion
          (criteriatypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Criteriatype error error
          done(criteriatypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Criteriatype that has an orphaned user reference', function (done) {
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

          // Save a new Criteriatype
          agent.post('/api/criteriatypes')
            .send(criteriatype)
            .expect(200)
            .end(function (criteriatypeSaveErr, criteriatypeSaveRes) {
              // Handle Criteriatype save error
              if (criteriatypeSaveErr) {
                return done(criteriatypeSaveErr);
              }

              // Set assertions on new Criteriatype
              (criteriatypeSaveRes.body.name).should.equal(criteriatype.name);
              should.exist(criteriatypeSaveRes.body.user);
              should.equal(criteriatypeSaveRes.body.user._id, orphanId);

              // force the Criteriatype to have an orphaned user reference
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

                    // Get the Criteriatype
                    agent.get('/api/criteriatypes/' + criteriatypeSaveRes.body._id)
                      .expect(200)
                      .end(function (criteriatypeInfoErr, criteriatypeInfoRes) {
                        // Handle Criteriatype error
                        if (criteriatypeInfoErr) {
                          return done(criteriatypeInfoErr);
                        }

                        // Set assertions
                        (criteriatypeInfoRes.body._id).should.equal(criteriatypeSaveRes.body._id);
                        (criteriatypeInfoRes.body.name).should.equal(criteriatype.name);
                        should.equal(criteriatypeInfoRes.body.user, undefined);

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
      Criteriatype.remove().exec(done);
    });
  });
});
