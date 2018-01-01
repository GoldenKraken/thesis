// Tests must be run while server is offline
// Expected database situation is after initial seed with 10000000 data points

const assert = require('assert');
const expect = require('chai').expect;
const supertest = require('supertest');

// Set up mongoose with promises since default promise library is deprecated
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const db = require('../database/AbandonedTotal.js');
mongoose.connect('mongodb://localhost/abandonment_calculator', { useMongoClient: true });
const app = require('../server/index.js');

var currCount;
db.AbandonedTotal.count()
  .then((count) => {
    currCount = count;
  });

describe('Calculation Process', () => {
  after(function(done) {
    this.timeout(0);
    console.log('Resetting database...');
    db.AbandonedTotal.remove({viewInstanceId: 92374985})
      .then(() => {
        console.log('All tests done!');
        done();
      });
  });
  //View Route currently deprecated due to use of SQS, below tests not able to be run
  xdescribe('View Route, Calculation, and Database Writing', () => {
    it('Responds with 200', (done) => {
      supertest(app)
        .post('/view')
        .set('Content-Type', 'application/json')
        .send('{"events":[{"videoId":12345,"viewInstanceId":92374985,"eventAction":"PLAY","event_timestamp":"2017-12-08 23:28:31+00:00"},{"videoId":12345,"viewInstanceId":92374985,"eventAction":"PAUSE","event_timestamp":"2017-12-08 23:33:31+00:00"},{"videoId":12345,"viewInstanceId":92374985,"eventAction":"END","event_timestamp":"2017-12-08 23:38:31+00:00"}]}')
        .expect(200, done);
    });
    it('Adds one file to the database', (done) => {
      db.AbandonedTotal.count()
        .then((count) => {
          expect(count).to.equal(currCount + 1);
          done();
        });
    });
    it('Calculates duration correctly', (done) => {
      db.AbandonedTotal.findOne({viewInstanceId: 92374985})
        .then((obj) => {
          expect(obj.dayFlag).to.equal(true);
          expect(obj.abandonFlag).to.equal(true);
          expect(JSON.stringify(obj.watchTimestamp)).to.equal('"2017-12-08T23:28:31.000Z"');
          expect(obj.yearWeek).to.equal('2017-49');
          done();
        });
    }).timeout(0);
  });
});
