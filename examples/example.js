var es = require('event-stream')
  , dxcomParser = require('../')
  ;
if (!module.parent) {
  es.pipeline(process.openStdin( )
    , dxcomParser.sugars( ), es.writeArray(done));
  function done (err, data) {
    console.log('records', data);
    console.log('FOUND ', data.length, 'records');
  }
}

