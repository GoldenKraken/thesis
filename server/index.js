const express = require('express');
const bodyParser = require('body-parser');

const db = require('../database/index.js');
const calculateDuration = require('../calculator/viewCalculator.js');
const calculateTOD = require('../calculator/dayNightCalculator.js');
const calculateYearWeek = require('../calculator/yearWeekCalculator.js');
const AbandonedTotal = require('../database/AbandonedTotal.js');

const app = express();

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// post route for incoming event packages (route name pending consensus with Event service)
app.post('/view', (req, res) => {
  var events = req.body.events;
  var dbData = {
    viewInstanceId: events[0].viewInstanceId,
    videoId: events[0].videoId,
    watchTimestamp: events[0].watchTimestamp,
    dayFlag: calculateTOD(events[0].watchTimestamp),
    yearWeek: calculateYearWeek(events[0].watchTimestamp),
    abandonFlag: calculateDuration(req.body.events)
  };
  AbandonedTotal.addToTable(dbData);
  res.send('data accepted');
});

const port = 1337;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});