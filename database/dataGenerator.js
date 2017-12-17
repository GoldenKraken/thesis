var fs = require('fs');

// you can either import your data generator or write it in this file
var viewInstanceId = 0;
var generateData = () => {
  var result = {
      viewInstanceId: viewInstanceId++,
      videoId: Math.floor(Math.random() * 100000),
      watchTimestamp: `2017-12-08 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}+00:00`,
      dayFlag: Math.floor(Math.random() * 2),
      yearWeek: '2017-49',
      abandonFlag: Math.floor(Math.random() * 2)
    };

  return JSON.stringify(result);
};

var stream = fs.createWriteStream("DBSEED.json", {'flags': 'a', 'encoding': null, 'mode': 0666});
console.log('\x1b[0m' + 'start');
stream.once('open', (fd) => {
  // this is setup to produce 2.5 mil lines, more than that in a single go slows my computer down but your mileage may vary. If you don't have a solid state drive... well this could take awhile
  // so just run this 4 times, it appends to the file if it exists, or creates a new one
    for (var i = 0; i < 5000000; i++) {
    
    // this is where the magic happens, run your function then append a new line
    // if it's JSON you need, then make sure your output has been through JSON.stringify()
      // the goal is just to have 10mil lines to represent records/docs for import.
      // wc -l <FILENAME> // In terminal this will give you the line count of the file
      stream.write(generateData() + '\n');

      if (i % 100000 === 0) {
    // console log every 100k to show progress
        console.log(i);
      }
    }
  
    stream.end();
    console.log('done');
});