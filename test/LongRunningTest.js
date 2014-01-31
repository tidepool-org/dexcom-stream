var should = require('should');
var fs = require('fs');

describe("the DxcomParser module", function() {

  describe("test big upload", function() {
    this.timeout(360000);
      it('should end ok', function(done) {
      var DxcomParser = require('../');
      var es = require('event-stream');

      var toProcess = fs.createReadStream('examples/dexcom_sample_with_and_without_meter_calibration.csv');

      es.pipeline(
        toProcess
        , DxcomParser.sugars( )
        , es.writeArray( function(err, readings) {
            console.log('Finished parsing', readings.length, 'records');
            readings.length.should.be.equal(700);
            done();
          })
      );
    });
  });

  describe('sugars',function(){
    it('should emit two events', function(done) {
      var DxcomParser, es, stream, bgTypeStream, toProcess, readings;

      DxcomParser = require('../');
      es = require('event-stream');
      readings = [];

      toProcess = fs.createReadStream('examples/dexcom_sample_with_meter_calibration.csv');

      stream = toProcess.pipe(DxcomParser.sugars( ));

      stream
        .on( 'data', function(data) {
            readings.push(data);
          })
        .on( 'end',  function(data) {
            if (data) { readings.push(data); }
            readings.length.should.be.equal(24); 
            done( );
        });
    });
  });
});

