// var MediaBitsRecorder = require('../lib/index.js');

var recorder = new MediaBitsRecorder({video: true, audio: true});
var recording = false;

var result = document.getElementById('bits');
result.innerHTML = '';

window.record = function(){
  if(recording){
    recorder.stop();
    recording = false;
    return;
  }

  recorder.start(1000);
  recording = true;
}

recorder.on('video', function(bits){
  result.innerHTML += 'video: ' + bits.substring(100, 200) + '(' + bits.length + ')<br>';
});

recorder.on('audio', function(bits){
  result.innerHTML += 'audio: ' + bits.substring(100, 200) + '(' + bits.length + ')<br><br>';
});
