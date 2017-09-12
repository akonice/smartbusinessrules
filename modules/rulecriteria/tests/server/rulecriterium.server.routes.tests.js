'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rulecriterium = mongoose.model('Rulecriterium'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  rulecriterium;

/**
 * Rulecriterium routes tests
 */
describe('Rulecriterium CRUD tests', function () {

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

    // Save a user to the test db and create new Rulecriterium
    user.save(function () {
      rulecriterium = {
        name: 'Rulecriterium name'
      };

      done();
    });
  });

  it('should be able to save a Rulecriterium if logged in', function (done) {
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

        // Save a new Rulecriterium
        agent.post('/api/rulecriteria')
          .send(rulecriterium)
          .expect(200)
          .end(function (rulecriteriumSaveErr, rulecriteriumSaveRes) {
            // Handle Rulecriterium save error
            if (rulecriteriumSaveErr) {
              return done(rulecriteriumSaveErr);
            }

            // Get a list of Rulecriteria
            agent.get('/api/rulecriteria')
              .end(function (rulecriteriaGetErr, rulecriteriaGetRes) {
                // Handle Rulecriteria save error
                if (rulecriteriaGetErr) {
                  return done(rulecriteriaGetErr);
                }

                // Get Rulecriteria list
                var rulecriteria = rulecriteriaGetRes.body;

                // Set assertions
                (rulecriteria[0].user._id).should.equal(userId);
                (rulecriteria[0].name).should.match('Rulecriterium name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Rulecriterium if not logged in', function (done) {
    agent.post('/api/rulecriteria')
      .send(rulecriterium)
      .expect(403)
      .end(function (rulecriteriumSaveErr, rulecriteriumSaveRes) {
        // Call the assertion callback
        done(rulecriteriumSaveErr);
      });
  });

  it('should not be able to save an Rulecriterium if no name is provided', function (done) {
    // Invalidate name field
    rulecriterium.name = '';

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

        // Save a new Rulecriterium
        agent.post('/api/rulecriteria')
          .send(rulecriterium)
          .expect(400)
          .end(function (rulecriteriumSaveErr, rulecriteriumSaveRes) {
            // Set message assertion
            (rulecriteriumSaveRes.body.message).should.match('Please fill Rulecriterium name');

            // Handle Rulecriterium save error
            done(rulecriteriumSaveErr);
          });
      });
  });

  it('should be able to update an Rulecriterium if signed in', function (done) {
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

        // Save a new Rulecriterium
        agent.post('/api/rulecriteria')
          .send(rulecriterium)
          .expect(200)
          .end(function (rulecriteriumSaveErr, rulecriteriumSaveRes) {
            // Handle Rulecriterium save error
            if (rulecriteriumSaveErr) {
              return done(rulecriteriumSaveErr);
            }

            // Update Rulecriterium name
            rulecriterium.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Rulecriterium
            agent.put('/api/rulecriteria/' + rulecriteriumSaveRes.body._id)
              .send(rulecriterium)
              .expect(200)
              .end(function (rulecriteriumUpdateErr, rulecriteriumUpdateRes) {
                // Handle Rulecriterium update error
                if (rulecriteriumUpdateErr) {
                  return done(rulecriteriumUpdateErr);
                }

                // Set assertions
                (rulecriteriumUpdateRes.body._id).should.equal(rulecriteriumSaveRes.body._id);
                (rulecriteriumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Rulecriteria if not signed in', function (done) {
    // Create new Rulecriterium model instance
    var rulecriteriumObj = new Rulecriterium(rulecriterium);

    // Save the rulecriterium
    rulecriteriumObj.save(function () {
      // Request Rulecriteria
      request(app).get('/api/rulecriteria')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Rulecriterium if not signed in', function (done) {
    // Create new Rulecriterium model instance
    var rulecriteriumObj = new Rulecriterium(rulecriterium);

    // Save the Rulecriterium
    rulecriteriumObj.save(function () {
      request(app).get('/api/rulecriteria/' + rulecriteriumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', rulecriterium.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Rulecriterium with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/rulecriteria/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rulecriterium is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Rulecriterium which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Rulecriterium
    request(app).get('/api/rulecriteria/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Rulecriterium with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Rulecriterium if signed in', function (done) {
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

        // Save a new Rulecriterium
        agent.post('/api/rulecriteria')
          .send(rulecriterium)
          .expect(200)
          .end(function (rulecriteriumSaveErr, rulecriteriumSaveRes) {
            // Handle Rulecriterium save error
            if (rulecriteriumSaveErr) {
              return done(rulecriteriumSaveErr);
            }

            // Delete an existing Rulecriterium
            agent.delete('/api/rulecriteria/' + rulecriteriumSaveRes.body._id)
              .send(rulecriterium)
              .expect(200)
              .end(function (rulecriteriumDeleteErr, rulecriteriumDeleteRes) {
                // Handle rulecriterium error error
                if (rulecriteriumDeleteErr) {
                  return done(rulecriteriumDeleteErr);
                }

                // Set assertions
                (rulecriteriumDeleteRes.body._id).should.equal(rulecriteriumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Rulecriterium if not signed in', function (done) {
    // Set Rulecriterium user
    rulecriterium.user = user;

    // Create new Rulecriterium model instance
    var rulecriteriumObj = new Rulecriterium(rulecriterium);

    // Save the Rulecriterium
    rulecriteriumObj.save(function () {
      // Try deleting Rulecriterium
      request(app).delete('/api/rulecriteria/' + rulecriteriumObj._id)
        .expect(403)
        .end(function (rulecriteriumDeleteErr, rulecriteriumDeleteRes) {
          // Set message assertion
          (rulecriteriumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Rulecriterium error error
          done(rulecriteriumDeleteErr);
        });

    });
  });

  it('should be able to get a single Rulecriterium that has an orphaned user reference', function (done) {
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

          // Save a new Rulecriterium
          agent.post('/api/rulecriteria')
            .send(rulecriterium)
            .expect(200)
            .end(function (rulecriteriumSaveErr, rulecriteriumSaveRes) {
              // Handle Rulecriterium save error
              if (rulecriteriumSaveErr) {
                return done(rulecriteriumSaveErr);
              }

              // Set assertions on new Rulecriterium
              (rulecriteriumSaveRes.body.name).should.equal(rulecriterium.name);
              should.exist(rulecriteriumSaveRes.body.user);
              should.equal(rulecriteriumSaveRes.body.user._id, orphanId);

              // force the Rulecriterium to have an orphaned user reference
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

                    // Get the Rulecriterium
                    agent.get('/api/rulecriteria/' + rulecriteriumSaveRes.body._id)
                      .expect(200)
                      .end(function (rulecriteriumInfoErr, rulecriteriumInfoRes) {
                        // Handle Rulecriterium error
                        if (rulecriteriumInfoErr) {
                          return done(rulecriteriumInfoErr);
                        }

                        // Set assertions
                        (rulecriteriumInfoRes.body._id).should.equal(rulecriteriumSaveRes.body._id);
                        (rulecriteriumInfoRes.body.name).should.equal(rulecriterium.name);
                        should.equal(rulecriteriumInfoRes.body.user, undefined);

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
      Rulecriterium.remove().exec(done);
    });
  });
});
