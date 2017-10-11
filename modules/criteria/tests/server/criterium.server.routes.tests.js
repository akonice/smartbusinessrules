'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Criterium = mongoose.model('Criterium'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  criterium;

/**
 * Criterium routes tests
 */
describe('Criterium CRUD tests', function () {

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

    // Save a user to the test db and create new Criterium
    user.save(function () {
      criterium = {
        name: 'Criterium name'
      };

      done();
    });
  });

  it('should be able to save a Criterium if logged in', function (done) {
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

        // Save a new Criterium
        agent.post('/api/criteria')
          .send(criterium)
          .expect(200)
          .end(function (criteriumSaveErr, criteriumSaveRes) {
            // Handle Criterium save error
            if (criteriumSaveErr) {
              return done(criteriumSaveErr);
            }

            // Get a list of Criteria
            agent.get('/api/criteria')
              .end(function (criteriaGetErr, criteriaGetRes) {
                // Handle Criteria save error
                if (criteriaGetErr) {
                  return done(criteriaGetErr);
                }

                // Get Criteria list
                var criteria = criteriaGetRes.body;

                // Set assertions
                (criteria[0].user._id).should.equal(userId);
                (criteria[0].name).should.match('Criterium name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Criterium if not logged in', function (done) {
    agent.post('/api/criteria')
      .send(criterium)
      .expect(403)
      .end(function (criteriumSaveErr, criteriumSaveRes) {
        // Call the assertion callback
        done(criteriumSaveErr);
      });
  });

  it('should not be able to save an Criterium if no name is provided', function (done) {
    // Invalidate name field
    criterium.name = '';

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

        // Save a new Criterium
        agent.post('/api/criteria')
          .send(criterium)
          .expect(400)
          .end(function (criteriumSaveErr, criteriumSaveRes) {
            // Set message assertion
            (criteriumSaveRes.body.message).should.match('Please fill Criterium name');

            // Handle Criterium save error
            done(criteriumSaveErr);
          });
      });
  });

  it('should be able to update an Criterium if signed in', function (done) {
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

        // Save a new Criterium
        agent.post('/api/criteria')
          .send(criterium)
          .expect(200)
          .end(function (criteriumSaveErr, criteriumSaveRes) {
            // Handle Criterium save error
            if (criteriumSaveErr) {
              return done(criteriumSaveErr);
            }

            // Update Criterium name
            criterium.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Criterium
            agent.put('/api/criteria/' + criteriumSaveRes.body._id)
              .send(criterium)
              .expect(200)
              .end(function (criteriumUpdateErr, criteriumUpdateRes) {
                // Handle Criterium update error
                if (criteriumUpdateErr) {
                  return done(criteriumUpdateErr);
                }

                // Set assertions
                (criteriumUpdateRes.body._id).should.equal(criteriumSaveRes.body._id);
                (criteriumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Criteria if not signed in', function (done) {
    // Create new Criterium model instance
    var criteriumObj = new Criterium(criterium);

    // Save the criterium
    criteriumObj.save(function () {
      // Request Criteria
      request(app).get('/api/criteria')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Criterium if not signed in', function (done) {
    // Create new Criterium model instance
    var criteriumObj = new Criterium(criterium);

    // Save the Criterium
    criteriumObj.save(function () {
      request(app).get('/api/criteria/' + criteriumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', criterium.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Criterium with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/criteria/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Criterium is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Criterium which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Criterium
    request(app).get('/api/criteria/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Criterium with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Criterium if signed in', function (done) {
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

        // Save a new Criterium
        agent.post('/api/criteria')
          .send(criterium)
          .expect(200)
          .end(function (criteriumSaveErr, criteriumSaveRes) {
            // Handle Criterium save error
            if (criteriumSaveErr) {
              return done(criteriumSaveErr);
            }

            // Delete an existing Criterium
            agent.delete('/api/criteria/' + criteriumSaveRes.body._id)
              .send(criterium)
              .expect(200)
              .end(function (criteriumDeleteErr, criteriumDeleteRes) {
                // Handle criterium error error
                if (criteriumDeleteErr) {
                  return done(criteriumDeleteErr);
                }

                // Set assertions
                (criteriumDeleteRes.body._id).should.equal(criteriumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Criterium if not signed in', function (done) {
    // Set Criterium user
    criterium.user = user;

    // Create new Criterium model instance
    var criteriumObj = new Criterium(criterium);

    // Save the Criterium
    criteriumObj.save(function () {
      // Try deleting Criterium
      request(app).delete('/api/criteria/' + criteriumObj._id)
        .expect(403)
        .end(function (criteriumDeleteErr, criteriumDeleteRes) {
          // Set message assertion
          (criteriumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Criterium error error
          done(criteriumDeleteErr);
        });

    });
  });

  it('should be able to get a single Criterium that has an orphaned user reference', function (done) {
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

          // Save a new Criterium
          agent.post('/api/criteria')
            .send(criterium)
            .expect(200)
            .end(function (criteriumSaveErr, criteriumSaveRes) {
              // Handle Criterium save error
              if (criteriumSaveErr) {
                return done(criteriumSaveErr);
              }

              // Set assertions on new Criterium
              (criteriumSaveRes.body.name).should.equal(criterium.name);
              should.exist(criteriumSaveRes.body.user);
              should.equal(criteriumSaveRes.body.user._id, orphanId);

              // force the Criterium to have an orphaned user reference
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

                    // Get the Criterium
                    agent.get('/api/criteria/' + criteriumSaveRes.body._id)
                      .expect(200)
                      .end(function (criteriumInfoErr, criteriumInfoRes) {
                        // Handle Criterium error
                        if (criteriumInfoErr) {
                          return done(criteriumInfoErr);
                        }

                        // Set assertions
                        (criteriumInfoRes.body._id).should.equal(criteriumSaveRes.body._id);
                        (criteriumInfoRes.body.name).should.equal(criterium.name);
                        should.equal(criteriumInfoRes.body.user, undefined);

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
      Criterium.remove().exec(done);
    });
  });
});
