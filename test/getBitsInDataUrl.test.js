process.env.NODE_ENV = 'test';

var assert = require('assert');

var padLeft = require('pad-left-simple');

var getBitsInDataUrl = require('../lib/getBitsInDataUrl');

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str).toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString();
  };
}

function makeDataUrl(data, base64){
  var url = "data:"
  if(base64) data = btoa(data);
  if(base64) url += ";base64";
  url += "," + data;
  return url;
}

describe('getBitsInDataUrl', function(){
  it('can obtain bits in plain data url', function(){
    var message = "Man";
    var bits = getBitsInDataUrl(makeDataUrl(message));
    assert.equal(bits, "010011010110000101101110");
  });

  it('can obtain bits in encoded data url', function(){
    var message = "Man";
    var bits = getBitsInDataUrl(makeDataUrl(message, true));
    assert.equal(bits, "010011010110000101101110");
  });
});
