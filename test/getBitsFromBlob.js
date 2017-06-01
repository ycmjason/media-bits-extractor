process.env.NODE_ENV = "test";

var assert = require('assert');

var _chunk  = require('lodash.chunk');

var getBitsFromBlob = require('../lib/getBitsFromBlob');

describe('getBitsFromBlob', function(){
  it('result bits should resemble the data', function(done){
    let b = new Blob(['hihi']);
    getBitsFromBlob(b, function(bits){
      let charCodes = _chunk(bits.split(''), 8)
        .map(bits => bits.join(''))
        .map(word => Number.parseInt(word, 2));
      let s = String.fromCharCode(...charCodes);
      assert.equal(s, 'hihi');
      done();
    });
  });
});
