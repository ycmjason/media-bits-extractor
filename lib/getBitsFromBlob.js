require('./polyfills');
const padLeft = require('pad-left-simple');

module.exports = function readBitsFromBlob(blob, cb){
  let fr = new FileReader();
  fr.onloadend = function(){
    let word_size_buffer = Array.from(new Uint8Array(fr.result));
    // each number in that word_size_buffer represents 8 bits
    let bits = word_size_buffer.map(n => padLeft(n.toString(2), 8, '0')).join('');
    cb(bits);
  };
  fr.readAsArrayBuffer(blob);
};
