var Sequelize = require('sequelize');
var sequelize = new Sequelize('abandoned_total', 'kai', 'password', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    aquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection successfully made to DB.');
  })
  .catch((error) => {
    console.error('Unable to connect to the DB: ', error);
  });


const abandoned_total = sequelize.define('abandoned_total', {
  viewInstanceId: { type: Sequelize.INTEGER, unique: true },
  videoId: Sequelize.INTEGER,
  watchTimestamp: Sequelize.DATE,
  dayFlag: Sequelize.BOOLEAN,
  yearWeek: Sequelize.STRING,
  abandonFlag: Sequelize.BOOLEAN
});