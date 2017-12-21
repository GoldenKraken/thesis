const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
// Elasticsearch needs to be downloaded to the main directory of this service, but will be gitignored
// to keep filesize small
const Elasticsearch = require('winston-elasticsearch');
const expressWinston = require('express-winston');

const db = require('../database/index.js');
const calculateDuration = require('../calculator/viewCalculator.js');
const calculateTOD = require('../calculator/dayNightCalculator.js');
const calculateYearWeek = require('../calculator/yearWeekCalculator.js');
const AbandonedTotal = require('../database/AbandonedTotal.js');

const app = express();

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

// post route for incoming event packages (route name pending consensus with Event service)
app.post('/view', (req, res) => {
  var events = JSON.parse(req.body.body).events;
  // video length is retrieved from video inventory when each package is received
  // currently just a placeholder
  var videoLength = 600;
  var firstTimestamp = events[0].event_timestamp;
  var dbData = {
    viewInstanceId: events[0].viewInstanceId,
    videoId: events[0].videoId,
    watchTimestamp: firstTimestamp,
    dayFlag: calculateTOD(firstTimestamp),
    yearWeek: calculateYearWeek(firstTimestamp),
    abandonFlag: Math.floor(calculateDuration(events) / (videoLength * (3 / 4)))
  };
  res.send('data accepted');
  AbandonedTotal.addToTable(dbData);
});

const port = 1337;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});