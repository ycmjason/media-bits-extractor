(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function EventEmitter() {
  this.eventHandlers = {};
}

EventEmitter.prototype.emit = function (eventname, data) {
  var handler = this.eventHandlers[eventname];
  if (handler) handler(data);
};

EventEmitter.prototype.on = function (eventname, handler) {
  if (typeof handler !== "function") throw "EventEmitter: handler not a function";
  this.eventHandlers[eventname] = handler;
};

module.exports = EventEmitter;

},{}],2:[function(require,module,exports){
'use strict';

require('./polyfills');
var padLeft = require('pad-left-simple');

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

module.exports = function readBitsFromBlob(blob, cb) {
  var fr = new FileReader();
  fr.onloadend = function () {
    var word_size_buffer = Array.from(new Int8Array(fr.result));
    // each number in that word_size_buffer represents 8 bits
    var bits = word_size_buffer.map(function (n) {
      return padLeft(dec2bin(n), 8, '0');
    }).join('');
    cb(bits);
  };
  fr.readAsArrayBuffer(blob);
};

},{"./polyfills":4,"pad-left-simple":5}],3:[function(require,module,exports){
'use strict';

var EventEmitter = require('./EventEmitter');
var getBitsFromBlob = require('./getBitsFromBlob');

function MediaBitsRecorder(config) {
  config.video = config.video || false;
  config.audio = config.audio || false;
  this.config = config;

  this.recorders = {
    video: null,
    audio: null
  };

  this.eventEmitter = new EventEmitter();
}

MediaBitsRecorder.prototype.on = function (type, handler) {
  return this.eventEmitter.on(type, handler);
};

MediaBitsRecorder.prototype.start = function (interval) {
  interval = interval || Infinity;
  var eventEmitter = this.eventEmitter;
  var config = this.config;
  var recorders = this.recorders;
  navigator.getUserMedia({ video: config.video, audio: config.audio }, function (s) {
    ['video', 'audio'].forEach(function (type) {
      if (!config[type]) return;

      var stream = new MediaStream();
      s.getTracks().filter(function (t) {
        return t.kind === type;
      }).forEach(function (t) {
        stream.addTrack(t);
      });

      recorders[type] = new MediaRecorder(stream);
    });

    ['video', 'audio'].forEach(function (type) {
      if (!recorders[type]) return;
      var mediaRecorder = recorders[type];
      mediaRecorder.start();

      mediaRecorder.ondataavailable = function (e) {
        var blob = e.data;
        getBitsFromBlob(blob, function (bits) {
          eventEmitter.emit(type, bits);
        });
      };

      if (interval < Infinity) {
        var i = setInterval(function () {
          if (mediaRecorder.state === "inactive") return clearInterval(i);
          mediaRecorder.requestData();
        }, interval);
      }
    });
  });
};

MediaBitsRecorder.prototype.stop = function () {
  var self = this;
  var recorders = this.recorders;
  ['video', 'audio'].forEach(function (type) {
    if (recorders[type]) {
      recorders[type].requestData();
      recorders[type].stop();
      recorders[type].stream.getTracks().forEach(function (t) {
        t.stop();
      });
    }
    recorders[type] = null;
  });
  return;
};

if (module && module.exports) module.exports = MediaBitsRecorder;
if (window) window.MediaBitsRecorder = MediaBitsRecorder;

},{"./EventEmitter":1,"./getBitsFromBlob":2}],4:[function(require,module,exports){
'use strict';

// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;
    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function toInteger(value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }();
}
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function value(_value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ? len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = _value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}
Number.parseInt = parseInt;

},{}],5:[function(require,module,exports){
module.exports = function leftPad(s, size, ch){
  if(s.length >= size) return s;
  if(ch === undefined) ch = ' ';
  var pad = new Array(size - s.length).fill(ch).join('');
  return pad + s;
}

},{}]},{},[3]);
