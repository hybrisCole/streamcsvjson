'use strict';
var Transform = require('stream').Transform,
  _ = require('lodash-node'),
  readline = require('readline'),
  moment = require('moment'),
  httpHandler = require('./httpHandler'),
  removeSpaceParser = new Transform(),
  jsonConverterParser = new Transform(),
  sizeCounter = {},
  JSONBatch = [],
  lineSplit = [],
  lineItems = 0,
  lineJSON = {},
  extranjeroDef = false,
  sexoDef = false,
  fechaNat = new Date(),
  fechaNac = new Date(),
  fechaDef = moment('19000101','YYYYMMDD'),
  totalRecords = 0,
  batchLengthDivider = 50000;


removeSpaceParser._transform = function(data, encoding, done) {
  //var extraSringRemoved = data.toString('utf-8').replace(new RegExp('[ ]{2,}', 'g'), ',');
  this.push(data);
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
    //console.log(totalRecords);
    totalRecords++;
    if((totalRecords > 0) && (totalRecords < 1700000)){
      lineSplit = line.replace(/["']/g, '').split(',');
      lineItems = lineSplit.length;
      if(!sizeCounter[lineItems]){
        sizeCounter[lineItems] = 0;
      }
      if(lineItems === 37){
        var fechaEntrada,
            fechaSuceso,
            fechaEntradaSplit = lineSplit[30],
            fechaSucesoSplit = lineSplit[31];
        if(fechaEntradaSplit!=='00000000' && fechaEntradaSplit!=='10000000'){
          fechaEntrada = moment(fechaEntradaSplit,'YYYYMMDD');
        }else{
          fechaEntrada = fechaDef;
        }
        if(fechaSucesoSplit!=='00000000' && fechaSucesoSplit!=='10000000'){
          fechaSuceso = moment(fechaSucesoSplit,'YYYYMMDD');
        }else{
          fechaEntrada = fechaDef;
        }
        lineJSON = {
          cita:lineSplit[0],
          cedulaHombre:lineSplit[1],
          nombreHombre:lineSplit[2],
          primerApellidoHombre:lineSplit[3],
          segundoApellidoHombre:lineSplit[4],
          conocidoHombre:lineSplit[5],
          padreHombre:lineSplit[6],
          nacionalidadPadreHombre:lineSplit[7],
          madreHombre:lineSplit[8],
          nacionalidadMadreHombre:lineSplit[9],
          extranjeroHombre:lineSplit[10],
          nacionalidadHombre:lineSplit[11],
          estadoCivilHombre:lineSplit[12],
          edadHombre:lineSplit[13],
          defuncionHombre:lineSplit[14],
          cedulaMujer:lineSplit[15],
          nombreMujer:lineSplit[16],
          primerApellidoMujer:lineSplit[17],
          segundoApellidoMujer:lineSplit[18],
          conocidoMujer:lineSplit[19],
          padreMujer:lineSplit[20],
          nacionalidadPadreMujer:lineSplit[21],
          madreMujer:lineSplit[22],
          nacionalidadMadreMujer:lineSplit[23],
          extranjeroMujer:lineSplit[24],
          nacionalidadMujer:lineSplit[25],
          estadoCivilMujer:lineSplit[26],
          edadMujer:lineSplit[27],
          defuncionMujer:lineSplit[28],
          lugarSuceso:lineSplit[29],
          fechaEntrada:fechaEntrada,
          fechaSuceso:fechaSuceso,
          provincia:lineSplit[32],
          canton:lineSplit[33],
          distrito:lineSplit[34],
          tipoMatrimonio:lineSplit[35],
          tipoRelacion:lineSplit[36]
        };
        JSONBatch.push(lineJSON);
        if(JSONBatch.length === batchLengthDivider){
          console.log('-------------');
          rl.pause();
          processBatch(JSONBatch).then(function(){
            //Por alguna razon siempre queda un remanente que hay que procesar...
            // Se supone que deberian ser solo 50k, pero siempre se van un poco mas
            JSONBatch.splice(0,batchLengthDivider);
            processBatch(JSONBatch).then(function(){
              JSONBatch = [];
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
    }
    /*
    *
    *
    * Distrito Electoral
    *
    * {
     codigoElectoral:lineSplit[0],
     provincia:lineSplit[1],
     canton:lineSplit[2],
     distrito:lineSplit[3]
     }
    *
    * */
    /*
    *
    * NAcimientos
    *
    * extranjeroDef = (lineSplit[8] !== '0');
     sexoDef = (lineSplit[7] !== '2');
     if(lineSplit[14]!=='00000000'){
     fechaNat = moment(lineSplit[6],'YYYYMMDD')
     }else{
     fechaNat = fechaDef;
     }
     if(lineSplit[6]!=='00000000'){
     fechaNac = moment(lineSplit[6],'YYYYMMDD')
     }else{
     fechaNac = fechaDef;
     }
     nacimientoJSON = {
     cedula:lineSplit[0],
     folio:lineSplit[1],
     cedulaPadre:lineSplit[2],
     cedulaMadre:lineSplit[3],
     codigoHospital:lineSplit[4],
     hora:lineSplit[5],
     fecha:fechaNac,
     sexo:sexoDef,
     nacionalidad:extranjeroDef,
     defuncion:lineSplit[9],
     paisPadre:lineSplit[10],
     paisMadre:lineSplit[11],
     relleno:lineSplit[12],
     provinciaMadre:lineSplit[13],
     fechaNaturalizacion:fechaNat,
     relleno2:lineSplit[15],
     primerApellido:lineSplit[16],
     segundoApellido:lineSplit[17],
     nombre:lineSplit[18],
     padreNombre:lineSplit[19],
     madreNombre:lineSplit[20],
     lugar:lineSplit[21]
     };
    * */
    /*
    * */
    /*DEFUNCION
    *
    *
    * extranjeroDef = (lineSplit[11] !== '0');
     sexoDef = (lineSplit[13] !== '2');
     defuncionJSON = {
     cita:lineSplit[0],
     cedula:lineSplit[1],
     conocidoComo:lineSplit[2],
     nombre:lineSplit[3],
     conocidoComoApellido1:lineSplit[4],
     apellido1:lineSplit[5],
     conocidoComoApellido2:lineSplit[6],
     apellido2:lineSplit[7],
     sitio:lineSplit[8],
     fecha:moment(lineSplit[9],'YYYYMMDD'),
     hora:lineSplit[10],
     extranjero:extranjeroDef,
     nacionalidad:lineSplit[12],
     sexo:sexoDef
     };
    *
    * */

    /*
    PADRON
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
    }*/
  });
  rl.on('close', function() {
    console.log(JSONBatch.length);
    console.log(sizeCounter);
  });
};

function processBatch(JSONBatch){
  var defer = require('node-promise').defer,
      deferred = defer(),
      JSONBatchReshape = reshape(JSONBatch,250),
      i = 0;
  console.log('separando batch en '+ JSONBatchReshape.length +' grupos de 1...');
  if(JSONBatchReshape.length > 0){
    _.each(JSONBatchReshape,function(miniBatch){
      httpHandler.enviarBatch(miniBatch).then(function(data){
        i+=1;
        console.log('Procesando grupo '+i);
        if(i === JSONBatchReshape.length){
          deferred.resolve();
        }
      });
    });
  }else{
    deferred.resolve();
  }

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