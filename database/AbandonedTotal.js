const mongoose = require('mongoose');
const db = require('./index');

const abandonedTotalSchema = new mongoose.Schema({
  viewInstanceId: Number,
  videoId: Number,
  watchTimestamp: Date,
  dayFlag: Boolean,
  yearWeek: String,
  abandonFlag: Boolean
});

const AbandonedTotal = mongoose.model('AbandonedTotal', abandonedTotalSchema);

var generateData = () => {
  var result = [];

  for (var i = 0; i < 100; i++) {
    result.push({
      viewInstanceId: Math.floor(Math.random() * 10000000),
      videoId: Math.floor(Math.random() * 100000),
      watchTimestamp: `2017-12-08 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}+00:00`,
      dayFlag: Math.floor(Math.random() * 2),
      yearWeek: '2017-49',
      abandonFlag: Math.floor(Math.random() * 2)
    });
  }

  return result;
};

AbandonedTotal.insertMany(generateData(), (err, data) => {
  if (err) { console.error(err); }
});

module.exports = AbandonedTotal;