'use strict';
var Transform = require('stream').Transform,
  _ = require('lodash-node'),
  readline = require('readline'),
  moment = require('moment'),
  httpHandler = require('./httpHandler'),
  removeSpaceParser = new Transform(),
  jsonConverterParser = new Transform(),
  sizeCounter = {};


removeSpaceParser._transform = function(data, encoding, done) {
  var extraSringRemoved = data.toString('utf-8').replace(new RegExp('[ ]{2,}', 'g'), ',');
  this.push(new Buffer(extraSringRemoved, 'utf-8'));
  done();
};

jsonConverterParser._transform = function(data,encoding, done){
  /*var lineList = data.toString('utf-8').split('\n');
  _.each(lineList,function(line){
    var lineItems = line.split(',').length;
    if(!sizeCounter[lineItems]){
      sizeCounter[lineItems] = 0;
    }
    sizeCounter[lineItems]+=1;
  });
  console.log(sizeCounter);*/
  //console.log(data);
  done();
}

module.exports.parseText = function(stream){
  var rl = readline.createInterface({
    input: stream.pipe(removeSpaceParser),
    output: stream.pipe(jsonConverterParser)
  });
  rl.on('line', function (line) {
    var lineSplit = line.split(','),
        lineItems = lineSplit.length;
    if(!sizeCounter[lineItems]){
      sizeCounter[lineItems] = 0;
    }
    if(lineItems === 4){
      if(lineSplit[0].indexOf('JORGE') !== -1 && lineSplit[1].indexOf('COLE')!==-1){
      var numericData = lineSplit[0].substring(0, 24);
      var padronJSON = {
        cedula: numericData.substring(0,9),
        codigoElectoral: numericData.substring(9,15),
        sexo: numericData.substring(15,16),
        nombre: lineSplit[0].substring(24),
        primerApellido: lineSplit[1],
        segundoApellido: lineSplit[2],
        fechaCaducidad : moment(numericData.substring(16,24),'YYYYMMDD'),
        campoRelleno:lineSplit[3]
      };
      httpHandler.enviarPadron(padronJSON);
      }
    }
    sizeCounter[lineItems]+=1;
  });
  rl.on('close', function() {
    console.log(sizeCounter);
  });

}

// Some programs like `head` send an error on stdout
// when they don't want any more data
process.stdout.on('error', process.exit);