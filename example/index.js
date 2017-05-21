// var MediaBitsExtractor = require('../lib/index.js');

var extractor = new MediaBitsExtractor({video: true, audio: true});
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
