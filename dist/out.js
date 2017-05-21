(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function EventEmitter(){
  this.eventHandlers = {}; 
}

EventEmitter.prototype.emit = function(eventname, data){
  var handler = this.eventHandlers[eventname];
  if(handler) handler(data);
};

EventEmitter.prototype.on = function(eventname, handler){
  if(typeof handler !== "function") throw "EventEmitter: handler not a function";
  this.eventHandlers[eventname] = handler;
};

module.exports = EventEmitter;

},{}],2:[function(require,module,exports){
var padLeft = require('pad-left-simple');

function byteCharsToBits(byteChars){
  return byteChars.split('').map(function(bc){
    return padLeft(bc.charCodeAt(0).toString(2), 8, '0')
  }).join('');
}

function getByteCharsInDataUrl(dataUrl){
  function id(x){
    return x;
  }
  var isBase64 = dataUrl.substring(dataUrl.indexOf(';') + 1, dataUrl.indexOf(',')) === "base64";
  var byteChars = (isBase64? atob: id)(dataUrl.substring(dataUrl.indexOf(',') + 1));
  return byteCharsToBits(byteChars);
}

module.exports = getByteCharsInDataUrl;

},{"pad-left-simple":4}],3:[function(require,module,exports){
var getBitsInDataUrl = require('./getBitsInDataUrl');
var EventEmitter = require('./EventEmitter');

function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
}

function MediaBitsExtractor(config){
  config.video = config.video || false;
  config.audio = config.audio || false;
  config.SAMPLING_RATE = config.SAMPLING_RATE || 1000;
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
          console.log(type, bits.length);
          eventEmitter.emit(type, bits);
        });
      };

      var i = setInterval(function(){
        if(mediaRecorder.state === "inactive") return clearInterval(i);
        mediaRecorder.requestData();
      }, config.SAMPLING_RATE);
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

},{"./EventEmitter":1,"./getBitsInDataUrl":2}],4:[function(require,module,exports){
module.exports = function leftPad(s, size, ch){
  if(s.length >= size) return s;
  if(ch === undefined) ch = ' ';
  var pad = new Array(size - s.length).fill(ch).join('');
  return pad + s;
}

},{}]},{},[3]);
