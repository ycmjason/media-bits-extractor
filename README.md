# media-bits-recorder
[![Build Status](https://travis-ci.org/ycmjason/media-bits-recorder.svg?branch=master)](https://travis-ci.org/ycmjason/media-bits-recorder)

This package is to extract bits from the video/audio device on the client side.

## Install
```
npm install --save media-bits-recorder
```

## Usage
### Script tag
```html
...

<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script> // getUserMedia shim
<script src="./node_modules/media-bits-recorder/dist/out.js"></script>

<script>
  var recorder = new MediaBitsRecorder({video: true, audio: false});
    console.log(bits); // "011010101001010..." as a string
  });

  ...

  // trigger the on event every 500 ms
  var interval = 500;
  recorder.start(interval);
  
  ...

  // never trigger on event until stop
  recorder.start();

  ...

  // trigger the on video/audio event
  recorder.stop();
</script>

...
```

### Browsify/Webpack
```javascript
var MediaBitsRecorder = require('media-bits-recorder');

var interval = 500;
var recorder = new MediaBitsRecorder({video: true, audio: true}, interval);
recorder.on('audio', function(bits){
  // this event is triggered every `interval`(500) ms
  console.log(bits); // "011010101001010..." as a string
});
recorder.on('video', function(bits){
  // this event is triggered every `interval`(500) ms
  console.log(bits); // "011010101001010..." as a string
});

recorder.start();

...

recorder.stop();
```

## Testing
```
npm test
```

## Live example
```
npm install
npm run build:example
PORT=8000 npm start
```

Open your browser: [http://localhost:8000](http://localhost:8000)


## Author
Jaosn Yu
