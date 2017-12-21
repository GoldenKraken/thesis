const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
// Elasticsearch and kibana are being downloaded to the main directory of this service, but will be gitignored
// to keep filesize small
const Elasticsearch = require('winston-elasticsearch');
const expressWinston = require('express-winston');
const axios = require('axios');
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const db = require('../database/index.js');
const calculateDuration = require('../calculator/viewCalculator.js');
const calculateTOD = require('../calculator/dayNightCalculator.js');
const calculateYearWeek = require('../calculator/yearWeekCalculator.js');
const AbandonedTotal = require('../database/AbandonedTotal.js');

const client = redis.createClient();

const app = express();

// redis setup
client.on('error', (error) => {
  console.log('Error: ', error);
});

// Setup winston to link to elasticsearch
app.use(expressWinston.logger({
  transports: [
    new Elasticsearch({
      level: 'info'
    })
  ]
}));

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// create function to calculate data and add row to table
var calculateAll = (res) => {
  var videoLength = res.duration;
  var firstTimestamp = events[0].event_timestamp;
  var dbData = {
    viewInstanceId: events[0].viewInstanceId,
    videoId: events[0].videoId,
    watchTimestamp: firstTimestamp,
    dayFlag: calculateTOD(firstTimestamp),
    yearWeek: calculateYearWeek(firstTimestamp),
    abandonFlag: Math.floor(calculateDuration(events) / (videoLength * (3 / 4)))
  };
  AbandonedTotal.addToTable(dbData);
};

// post route for incoming event packages (route name pending consensus with Event service)
app.post('/view', (req, res) => {
  // events object needs to change depending on whether or not its being tested with artillery
  var events = JSON.parse(req.body.body).events;
  // will replace fake route with actual location of video inventory service once ready for deployment
  res.send('data accepted');
  axios.get('http://localhost:1337/vidLengthTest', {
    params: {
      videoId: events[0].videoId
    }
  })
    .then(function(res) {
      calculateAll(res);
    });
});

app.get('/vidLengthTest', (req, res) => {
  res.send(JSON.stringify({ duration: 600 }));
});

const port = 1337;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});