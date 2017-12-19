// this code calculates the year and week of a timestamp and turns it into a string for use in my database

// this function adds a getWeek calculator 
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

var calculateYearWeek = (timestamp) => {
  timestamp = new Date(timestamp);
  var year = timestamp.getFullYear();
  var week = timestamp.getWeek();
  return `${year}-${week}`;
};

module.exports = calculateYearWeek;