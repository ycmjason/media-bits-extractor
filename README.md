# media-bits-extractor
[![Build Status](https://travis-ci.org/ycmjason/media-bits-extractor.svg?branch=master)](https://travis-ci.org/ycmjason/media-bits-extractor)

This package is to extract bits from the video/audio device on the client side.

## Install
```
npm install --save media-bits-extractor
```

## Usage
### Script tag
```html
...

<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script> // getUserMedia shim
<script src="./node_modules/media-bits-extractor/dist/out.js"></script>

<script>
  var interval = 500;
  var extractor = new MediaBitsExtractor({video: true, audio: false}, interval);
  extractor.on('video', function(bits){
    // this event is triggered every `interval`(500) ms
    console.log(bits); // "011010101001010..." as a string
  });

  extractor.start();

  ...

  extractor.stop();
</script>

...
```

### Browsify/Webpack
```javascript
var MediaBitsExtractor = require('media-bits-extractor');

var interval = 500;
var extractor = new MediaBitsExtractor({video: true, audio: true}, interval);
extractor.on('audio', function(bits){
  // this event is triggered every `interval`(500) ms
  console.log(bits); // "011010101001010..." as a string
});
extractor.on('video', function(bits){
  // this event is triggered every `interval`(500) ms
  console.log(bits); // "011010101001010..." as a string
});

extractor.start();

...

extractor.stop();
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
