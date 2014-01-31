var should = require('should');

describe("the DxcomParser module", function() {
  it('should not crash require', function(done) {
    var DxcomParser = require('../');
    should.exist(DxcomParser);
    done();
  });
  it('is callable', function(done) {
    var DxcomParser = require('../');
    should.exist(DxcomParser.call);
    done();
  });
  describe("as a stream", function() {
    var DxcomParser = require('../');
    it('is pipeable', function(done) {
      should.exist(DxcomParser( ).pipe.call);
      done();
    });
  });
  describe("has a map of csv columns", function() {
    it('has a columns map', function(done) {
      var DxcomParser = require('../');
      should.exist(DxcomParser.columns);
      done();
    });
    it('GlucoseInternalTime exists', function(done) {
      var DxcomParser = require('../');
      var columns = DxcomParser.columns();
      columns['GlucoseInternalTime_1'].should.equal(2);
      done();
    });
    it('GlucoseDisplayTime exists', function(done) {
      var DxcomParser = require('../');
      var columns = DxcomParser.columns();
      columns['GlucoseDisplayTime_1'].should.equal(3);
      done();
    });
    it('Glucose Value exists', function(done) {
      var DxcomParser = require('../');
      var columns = DxcomParser.columns();
      columns['GlucoseValue_1'].should.equal(4);
      done();
    });
  });
  describe("splitBGRecords", function() {
    it('should exist', function(done) {
      var DxcomParser = require('../');
      should.exist(DxcomParser.splitBGRecords);
      
      done();
    });
    it('should split one valid record', function(done) {
      var DxcomParser = require('../');
      var rawData = '\t\t2012-12-20 12:18:54\t2012-12-20 04:18:45\t220\t2012-12-27 10:04:40\t2012-12-27 02:04:31\t208\t\t\t\t\t';
      
      var results = DxcomParser.splitBGRecords(rawData);
      
      results.length.should.equal(1);

      done();
    });
  });
  describe("isValidCbg", function() {
    it('should exist', function(done) {
      var DxcomParser = require('../');
      should.exist(DxcomParser.isValidCbg);
      done();
    });
    it('should return true for cbg with value and valid date', function(done) {
      var DxcomParser = require('../');
      var cbg = { value: '220', type: 'cbg', time: '2012-12-19T15:18:45+00:00' };

      DxcomParser.isValidCbg(cbg).should.be.true;

      done();
    });
    it('should return false for no cbg with no value ', function(done) {
      var DxcomParser = require('../');
      var cbg = { value: '', type: 'cbg', time: '2012-12-19T15:18:45+00:00' };

      DxcomParser.isValidCbg(cbg).should.be.false;

      done();
    });
    it('should return false for no cbg with invald date', function(done) {
      var DxcomParser = require('../');
      var cbg = { value: '220', type: 'cbg', time: 'not a date' };

      DxcomParser.isValidCbg(cbg).should.be.false;

      done();
    });
  });

  describe('time',function(){
    it('should show year 2012, month Dec and day 20 for given raw time of 2012-12-20 04:18:45', function(done) {
      var DxcomParser, es, stream, bgTypeStream, toProcess;

      DxcomParser = require('../');
      es = require('event-stream');
      toProcess = es.readArray([ '\t\t2012-12-20 12:18:54\t2012-12-20 04:18:45\t220\t2012-12-27 10:04:40\t2012-12-27 02:04:31\t208\t\t\t\t\t' ]);
      
      stream = toProcess.pipe(DxcomParser.sugars( ));

      es.pipeline(stream, es.writeArray(proof));
      function proof (err, readings) {
        readings[0].time.should.equal('2012-12-20T04:18:45');
        done( );
      }
    });
  })
});

