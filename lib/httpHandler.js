#! /usr/bin/env node
/*
 * streamcsvjson
 * https://github.com/hybrisCole/streamcsvjson.git
 *
 * Copyright (c) 2014 Alberto Cole
 * Licensed under the MIT license.
 */
'use strict';

var http = require('http');

module.exports.enviarPadron = function(padronJSON){
  var padronJSONString = JSON.stringify(padronJSON);
  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': padronJSONString.length
  };
  var options = {
    host: 'udyat.jit.su',
    port: 80,
    path: '/padron/crear',
    method: 'POST',
    headers: headers
  };
  // Setup the request.  The options parameter is
  // the object we defined above.
  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      var resultObject = JSON.parse(responseString);
      console.log('res.on(end)');
      console.log(resultObject);
    });
  });
  req.on('error', function(err) {
    console.log(err);
  });
  req.write(padronJSONString);
  req.end();
}