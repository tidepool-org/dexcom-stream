dxcom-parser
===========

Parser for Dexcom CGM

# Usage

```js
var fs = require('fs'),
	es = require('event-stream'),
	dxcom = require('dxcom-parser'),
  timeZone = 120;

var stream = fs.createReadStream('./examples/dexcom_sample_with_and_without_meter_calibration.csv');

es.pipeline(stream, dxcom.sugars(timeZone)
  , es.map( function (data, cb) {
      // do something with each record
      console.log(data);
      cb(null, data); // make sure you call cb.

    })
  , es.writeArray( function(err, readings) {
      // do something with all readings
      console.log('Done parsing', readings);
    })
);
```

```bash
cat examples/dexcom_sample_with_and_without_meter_calibration.csv | head | node index.js
{"cbg":"156","type":"cgm","time":"2012-12-20T18:28:55.000Z"}
{"cbg":"171","type":"cgm","time":"2012-12-20T18:33:54.000Z"}
{"cbg":"162","type":"cgm","time":"2012-12-20T18:38:54.000Z"}
{"cbg":"167","type":"cgm","time":"2012-12-20T18:43:54.000Z"}
{"cbg":"163","type":"cgm","time":"2012-12-20T18:48:54.000Z"}
{"cbg":"177","type":"cgm","time":"2012-12-20T18:53:54.000Z"}
{"cbg":"184","type":"cgm","time":"2012-12-20T18:58:54.000Z"}
{"cbg":"187","type":"cgm","time":"2012-12-20T19:03:54.000Z"}
{"cbg":"188","type":"cgm","time":"2012-12-20T19:08:54.000Z"}
```

