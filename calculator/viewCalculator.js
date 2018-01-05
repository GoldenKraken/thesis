// this code calculates the total view time from one viewing instance using the timestamps given
// from a package of events received from the Event service

// this will be done after a query has been made and returned from the Video service to get the video's length

// the object this function will calculate from will be an unordered array of events that will need to be listed in order of timestamp
// once ordered, it will need tot calculate total viewing duration

// * add any time between a play and a pause
// * if a scrub is between a play and another event, ignore it,
// the view duration effect is minimal and the video continues to be watched after the scrub
// * if a pause happens, don't add the time between it and the next play
// * if a scrub happens between a pause and another event, ignore it, the video doesn't continue after that scrub
// * follow the previous scrub rules for fast forward and rewind as well.

/*
  example object
{
  events: [
    {
      videoId: 12345,
      viewInstanceId: 92374985,
      eventAction: ‘PLAY’,
      event_timestamp: '2017-12-08 23:28:31+00:00'
    },
    {
      videoId: 12345,
      viewInstanceId: 92374985,
      eventAction: ‘END’,
      event_timestamp: '2017-12-08 23:38:31+00:00'
    },
    {
      videoId: 12345,
      viewInstanceId: 92374985,
      eventAction: ‘PAUSE’,
      event_timestamp: '2017-12-08 23:33:31+00:00'
    }
  ]
}

*/


var calculateDuration = (events) => {
  var orderedInstance = [];
  var i = 0;
  var orderEvents = () => {
    if (events.length === 0) {
      return;
    }
    var currentMin = 0;
    for (var j = 1; j < events.length; j++) {
      if (new Date(events[j].event_timestamp) < new Date(events[currentMin].event_timestamp)) {
        currentMin = j;
      }
    }
    orderedInstance = orderedInstance.concat(events.splice(currentMin, 1));
    orderEvents();
  };
  orderEvents();
  var duration = 0;
  var playOrPause = '';
  for (var k = 0; k < orderedInstance.length - 1; k++) {
    var currEvent = orderedInstance[k];
    var nextEvent = orderedInstance[k + 1];
    var eventAction = currEvent.eventAction;
    var nextTimestamp = new Date(nextEvent.event_timestamp);
    var currTimestamp = new Date(currEvent.event_timestamp);
    if (k > 0) {
      if (eventAction === 'REWIND' || eventAction === 'FASTFWD' || eventAction === 'SCRUB') {
        if (playOrPause === 'PLAY') {
          duration = duration + nextTimestamp - currTimestamp;
        }
      }
    }
    if (currEvent.eventAction === 'PLAY') {
      duration = duration + nextTimestamp - currTimestamp;
      playOrPause = 'PLAY';
    }
    if (currEvent.eventAction === 'PAUSE') {
      playOrPause = 'PAUSE';

    }
  }

  return duration / 1000;
};

module.exports = calculateDuration;

// var testObj = {
//   events: [
//     {
//       videoId: 12345,
//       viewInstanceId: 92374985,
//       eventAction: 'SCRUB',
//       event_timestamp: '2017-12-08 23:29:31+00:00'
//     },
//     {
//       videoId: 12345,
//       viewInstanceId: 92374985,
//       eventAction: 'PLAY',
//       event_timestamp: '2017-12-08 23:28:31+00:00'
//     },
//     {
//       videoId: 12345,
//       viewInstanceId: 92374985,
//       eventAction: 'PLAY',
//       event_timestamp: '2017-12-08 23:34:31+00:00'
//     },
//     {
//       videoId: 12345,
//       viewInstanceId: 92374985,
//       eventAction: 'END',
//       event_timestamp: '2017-12-08 23:38:31+00:00'
//     },
//     {
//       videoId: 12345,
//       viewInstanceId: 92374985,
//       eventAction: 'PAUSE',
//       event_timestamp: '2017-12-08 23:33:31+00:00'
//     }
//   ]
// };

// calculateDuration(testObj.events);








