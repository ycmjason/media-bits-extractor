// var MediaBitsExtractor = require('../lib/index.js');

var extractor = new MediaBitsExtractor({video: true, audio: true}, 500);
var recording = false;

window.record = function(){
  if(recording){
    extractor.stop();
    recording = false;
    return;
  }

  extractor.start();
  recording = true;
}

extractor.on('video', function(bits){
  console.log('video', typeof bits, bits.length);
});

extractor.on('audio', function(bits){
  console.log('audio', typeof bits, bits.length);
});
