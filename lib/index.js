var getBitsInDataUrl = require('./getBitsInDataUrl');
var EventEmitter = require('./EventEmitter');

function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
}

function MediaBitsExtractor(config, interval){
  config.video = config.video || false;
  config.audio = config.audio || false;
  this.interval = interval || 1000;
  this.config = config;

  this.recorders = {
    video: null,
    audio: null
  };

  this.eventEmitter = new EventEmitter();
}

MediaBitsExtractor.prototype.on = function(type, handler){
  return this.eventEmitter.on(type, handler);
};

MediaBitsExtractor.prototype.start = function(){
  var eventEmitter = this.eventEmitter;
  var config = this.config;
  var recorders = this.recorders;
  var interval = this.interval;
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

      var i = setInterval(function(){
        if(mediaRecorder.state === "inactive") return clearInterval(i);
        mediaRecorder.requestData();
      }, interval);
    });
  });
};

MediaBitsExtractor.prototype.stop = function(){
  var self = this;
  ['video', 'audio'].forEach(function(type){
    if(self.recorders[type]){
      self.recorders[type].stop();
      self.recorders[type].stream.getTracks().forEach(function(t){ t.stop();});
    }
    self.recorders[type] = null;
  });
  return;
};

if(module && module.exports) module.exports = MediaBitsExtractor;
if(window) window.MediaBitsExtractor = MediaBitsExtractor;
