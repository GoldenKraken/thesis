const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/abandonment_calculator');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('mongoose connected successfully'); });

module.exports = db;