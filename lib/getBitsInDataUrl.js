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
