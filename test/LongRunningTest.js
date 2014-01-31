var should = require('should');
var fs = require('fs');

describe("the DxcomParser module", function() {

  describe("test big upload", function() {
    this.timeout(360000);
      it('should end ok', function(done) {
      var DxcomParser = require('../');
      var es = require('event-stream');
      var timeZone = -760;

      var toProcess = fs.createReadStream('examples/dexcom_sample_with_and_without_meter_calibration.csv');

      es.pipeline(
        toProcess
        , DxcomParser.sugars(timeZone)
        , es.writeArray( function(err, readings) {
            console.log('Finished parsing', readings.length, 'records');
            readings.length.should.be.equal(700);
            done();
          })
      );
    });
  });
});

