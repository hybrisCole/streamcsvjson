#! /usr/bin/env node
/*
 * streamcsvjson
 * https://github.com/hybrisCole/streamcsvjson.git
 *
 * Copyright (c) 2014 Alberto Cole
 * Licensed under the MIT license.
 */
'use strict';

var http = require('http'),
  padronJSONString = '',
  headers = {},
  options = {
    host: 'udyat.jit.su',
    port: 80,
    path: '/padron/crearBatch',
    method: 'POST'
  },
  req = {};
module.exports.enviarPadron = function(padronJSON){
  var defer = require('node-promise').defer,
  deferred = defer()
  var options = {
    hostname: 'udyat.jit.su',
    port: 80,
    path: '/padron/crearBatch',
    method: 'POST'
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');

    var responseString = '';

    res.on('data', function (chunk) {
      responseString += chunk;
    });
    res.on('end', function () {
      deferred.resolve(JSON.parse(responseString));
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

// write data to request body
  req.write(JSON.stringify(padronJSON));
  req.end();
  return deferred.promise;
}