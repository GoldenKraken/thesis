const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 1337;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});