'use strict';
var Transform = require('stream').Transform,
  _ = require('lodash-node'),
  readline = require('readline'),
  moment = require('moment'),
  httpHandler = require('./httpHandler'),
  removeSpaceParser = new Transform(),
  jsonConverterParser = new Transform(),
  sizeCounter = {},
  padronJSONBatch = [],
  lineSplit = [],
  lineItems = 0,
  numericData = '',
  padronJSON = {},
  totalRecords = 0;


removeSpaceParser._transform = function(data, encoding, done) {
  var extraSringRemoved = data.toString('utf-8').replace(new RegExp('[ ]{2,}', 'g'), ',');
  this.push(new Buffer(extraSringRemoved, 'utf-8'));
  done();
};

jsonConverterParser._transform = function(data,encoding, done){
  done();
}

module.exports.parseText = function(stream){
  var rl = readline.createInterface({
    input: stream.pipe(removeSpaceParser),
    output: stream.pipe(jsonConverterParser)
  });
  rl.on('line', function (line) {
    totalRecords++;
    lineSplit = line.split(',');
    lineItems = lineSplit.length;
    if(!sizeCounter[lineItems]){
      sizeCounter[lineItems] = 0;
    }
    if(lineItems === 4){
      numericData = lineSplit[0].substring(0, 24);
      padronJSON = {
        cedula: numericData.substring(0,9),
        codigoElectoral: numericData.substring(9,15),
        sexo: numericData.substring(15,16),
        nombre: lineSplit[0].substring(24),
        primerApellido: lineSplit[1],
        segundoApellido: lineSplit[2],
        fechaCaducidad : moment(numericData.substring(16,24),'YYYYMMDD'),
        campoRelleno:lineSplit[3]
      };
      padronJSONBatch.push(padronJSON);
      if(padronJSONBatch.length === 50000){
        console.log('-------------');
        rl.pause();
        processBatch(padronJSONBatch).then(function(){
          padronJSONBatch.splice(0,50000);
          processBatch(padronJSONBatch).then(function(){
            padronJSONBatch = [];
            setTimeout(function(){
              console.log(totalRecords);
              rl.resume();
              console.log('-------------');
              console.log('');
            },3000);

          });
        });
      }
    }
    sizeCounter[lineItems]+=1;
  });
  rl.on('close', function() {
    console.log(padronJSONBatch.length);
    console.log(sizeCounter);
  });
}

function processBatch(padronJSONBatch){
  var defer = require('node-promise').defer,
      deferred = defer(),
      padronJSONBatchReshape = reshape(padronJSONBatch,500),
      i = 0;
  console.log('separando batch en '+ padronJSONBatchReshape.length +' grupos de 500...');
  _.each(padronJSONBatchReshape,function(miniBatch){
    httpHandler.enviarPadron(miniBatch).then(function(data){
      i+=1;
      console.log('Procesando grupo '+i);
      if(i === padronJSONBatchReshape.length){
        deferred.resolve();
      }
    });
  });
  return deferred.promise;
};

function reshape(array, n){
  return _.compact(array.map(function(el, i){
    if (i % n === 0) {
      return array.slice(i, i + n);
    }
  }))
}

// Some programs like `head` send an error on stdout
// when they don't want any more data
process.stdout.on('error', process.exit);