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

const addToTable = (obj) => {
  AbandonedTotal.create(obj, function(err) {
    if (err) { console.log('ERROR: ', err); }
  });
};

module.exports.AbandonedTotal = AbandonedTotal;
module.exports.addToTable = addToTable;