dexcom-stream
===========

Streaming parser for Dexcom CGM text exports.

## Install 

```bash
$ npm install dexcom-stream
```

### Usage

```js
var fs = require('fs'),
	es = require('event-stream'),
	dxcom = require('dexcom-stream'),
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


##### Example: print everything to stdout
```javascript
if (!module.parent) {
  es.pipeline(
      process.openStdin( )
    , dxcomParser.sugars( )
    , es.writeArray(function (err, data) {
      console.log('records', data);
      console.log('FOUND ', data.length, 'records');

    })
  );
}
```

```bash
cat examples/dexcom_sample_with_and_without_meter_calibration.csv | head | node index.js
records [ { value: '156', type: 'cbg', time: '2012-12-20T02:28:46' },
  { value: '171', type: 'cbg', time: '2012-12-20T02:33:45' },
  { value: '162', type: 'cbg', time: '2012-12-20T02:38:45' },
  { value: '167', type: 'cbg', time: '2012-12-20T02:43:45' },
  { value: '163', type: 'cbg', time: '2012-12-20T02:48:45' },
  { value: '177', type: 'cbg', time: '2012-12-20T02:53:45' },
  { value: '184', type: 'cbg', time: '2012-12-20T02:58:45' },
  { value: '187', type: 'cbg', time: '2012-12-20T03:03:45' },
  { value: '188', type: 'cbg', time: '2012-12-20T03:08:45' } ]
FOUND  9 records
```
