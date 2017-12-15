const express = require('express');
const app = express();
const db = require('../database/index.js');
//const AbandonedTotal = require('../database/AbandonedTotal.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 1337;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});