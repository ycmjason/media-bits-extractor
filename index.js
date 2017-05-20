var record = (function(){
  var playing = false;
  return function(){
    navigator.getUserMedia({ audio: true }, function (stream) {
      var audio = document.querySelector('audio');

      //inserting our stream to the video tag
      audio.srcObject = stream;

      playing = true;
    });
  }
})();
