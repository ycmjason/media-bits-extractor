require('./polyfills');
const padLeft = require('pad-left-simple');

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

module.exports = function readBitsFromBlob(blob, cb){
  let fr = new FileReader();
  fr.onloadend = function(){
    let word_size_buffer = Array.from(new Int8Array(fr.result));
    // each number in that word_size_buffer represents 8 bits
    let bits = word_size_buffer.map(n => padLeft(dec2bin(n), 8, '0')).join('');
    cb(bits);
  };
  fr.readAsArrayBuffer(blob);
};
