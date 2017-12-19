// this function takes a timestamp and calculates whether or not the time falls between 6am and 6pm
// it will return true if it does, and false if it does not

var calculateTOD = (timestamp) => {
  var date = new Date(timestamp);
  var hour = date.getHours();
  if (hour >= 6 && hour < 18) {
    return 1;
  }
  return 0;
};

module.exports = calculateTOD;