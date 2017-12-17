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

module.exports = AbandonedTotal;