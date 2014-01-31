'use strict';
var dxcomParser, columns, es;

es = require('event-stream');
var moment = require('moment');

columns = {};

columns['NA_1'] = 0;
columns['NA_2'] = 1;

columns['GlucoseInternalTime_1'] = 2;
columns['GlucoseDisplayTime_1'] = 3;
columns['GlucoseValue_1'] = 4;

columns['MeterInternalTime_2'] = 5;
columns['MeterDisplayTime_2'] = 6;
columns['MeterGlucoseValue_2'] = 7;


var DEXCOM_TIME = 'YYYY-MM-DD HH:mm:ss';
var OUTPUT_TIME = 'YYYY-MM-DDTHH:mm:ss';
function reformatISO (str) {
  var m = moment(str, DEXCOM_TIME);
  return m.format(OUTPUT_TIME);
}

function validTime (str) {
  return moment(str, OUTPUT_TIME).isValid( );
}

dxcomParser = function() {
  var responder, stream;
  
  stream = es.pipeline(es.split(), es.map(function(data, cb) {
    
    if(data){
      var sugarsInRow = splitBGRecords(data);

      sugarsInRow.forEach(function(sugar){
        var rec = {
          type: 'cbg',
          data: sugar
        };
        stream.emit('type', rec);
      });
    }
    return cb();
  }));

  responder = function(filter) {
    var tr;
    tr = es.through();
    stream.on('type', function(data) {
      if (data.type.match(filter)) {
        return tr.push(data.data);
      }
    });
    return es.pipeline(stream, tr);
  };

  stream.sugars = function( ) {
    return es.pipeline(responder('cbg'), es.map(parse), es.map(valid)); 
  };

  stream.responder = responder;
  return stream;
};

dxcomParser.sugars = function( ) {
  return dxcomParser().sugars( );
};

dxcomParser.columns = function() {
  return columns;
};

dxcomParser.splitBGRecords =function(rawData){
  return splitBGRecords(rawData);
};

dxcomParser.isValidCbg = function(cbg){
  return isValidCbg(cbg);
};

function parse (rawData, callback) {
  var entryValues, processedSugar;

  var stringReadingToNum = function(value) {
    if (rawData.value.match(/lo./i)) {
      return "39";
    }
    else if (rawData.value.match(/hi./i)) {
      return "401";
    }
  }

  if ((rawData.value.match(/lo./i)) || rawData.value.match(/hi./i)) {
    processedSugar = {
      value: stringReadingToNum(rawData.value),
      type: 'cbg',
      time: reformatISO(rawData.displayTime),
      special: rawData.value
    };
  }
  else {     
    processedSugar = {
      value: rawData.value,
      type: 'cbg',
      time: reformatISO(rawData.displayTime)
    }; 
  }

  return callback(null, processedSugar);
}

function valid (data, next) {
  if (isValidCbg(data)) {
    return next(null, data);
  }
  next( );
}

function isValidCbg (cbg) {
  if (isNaN(parseInt(cbg.value))) {
    if (cbg.value.match(/lo./i) || cbg.value.match(/hi./i)) {
      return (cbg.type === 'cbg' && validTime(cbg.time));
    }
    else {
      return false;
    }
  }
  else {  
    return (!isNaN(parseInt(cbg.value)) &&
      cbg.type === 'cbg' && validTime(cbg.time));
  }

};

var splitBGRecords = function(rawData){
  var records, entryValues, sugarOne, sugarTwo;

  entryValues = rawData.split('\t');
  sugarOne = {};

  sugarOne.value = entryValues[columns['GlucoseValue_1']];
  sugarOne.displayTime = entryValues[columns['GlucoseDisplayTime_1']];

  records = [sugarOne];
  return records;
};

module.exports = dxcomParser;

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

