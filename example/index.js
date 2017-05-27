// var MediaBitsExtractor = require('../lib/index.js');

var recorder = new MediaBitsExtractor({video: true, audio: true}, 500);
var recording = false;

window.record = function(){
  if(recording){
    recorder.stop();
    recording = false;
    return;
  }

  recorder.start();
  recording = true;
}

recorder.on('video', function(bits){
  console.log('video', typeof bits, bits.length);
});

recorder.on('audio', function(bits){
  console.log('audio', typeof bits, bits.length);
});
