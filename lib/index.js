var getBitsInDataUrl = require('./getBitsInDataUrl');
var EventEmitter = require('./EventEmitter');

function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
}

function MediaBitsRecorder(config){
  config.video = config.video || false;
  config.audio = config.audio || false;
  this.config = config;

  this.recorders = {
    video: null,
    audio: null
  };

  this.eventEmitter = new EventEmitter();
}

MediaBitsRecorder.prototype.on = function(type, handler){
  return this.eventEmitter.on(type, handler);
};

MediaBitsRecorder.prototype.start = function(interval){
  interval = interval || Infinity;
  var eventEmitter = this.eventEmitter;
  var config = this.config;
  var recorders = this.recorders;
  navigator.getUserMedia({ video: config.video, audio: config.audio }, function (s) {
    ['video', 'audio'].forEach(function(type){
      if(!config[type]) return;

      var stream = new MediaStream();
      s.getTracks().filter(function(t){
        return t.kind === type;
      }).forEach(function(t){
        stream.addTrack(t);
      });

      recorders[type] = new MediaRecorder(stream);
    });

    ['video', 'audio'].forEach(function(type){
      if(!recorders[type]) return;
      var mediaRecorder = recorders[type];
      mediaRecorder.start();

      mediaRecorder.ondataavailable = function(e){
        blobToDataURL(e.data, function(dataUrl){
          var bits = getBitsInDataUrl(dataUrl);
          eventEmitter.emit(type, bits);
        });
      };

      if(interval < Infinity){
        var i = setInterval(function(){
          if(mediaRecorder.state === "inactive") return clearInterval(i);
          mediaRecorder.requestData();
        }, interval);
      }
    });
  });
};

MediaBitsRecorder.prototype.stop = function(){
  var self = this;
  var recorder = this.recorder;
  ['video', 'audio'].forEach(function(type){
    if(recorders[type]){
      recorders[type].requestData();
      recorders[type].stop();
      recorders[type].stream.getTracks().forEach(function(t){ t.stop();});
    }
    recorders[type] = null;
  });
  return;
};

if(module && module.exports) module.exports = MediaBitsRecorder;
if(window) window.MediaBitsRecorder = MediaBitsRecorder;
