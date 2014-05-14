#! /usr/bin/env node
/*
 * streamcsvjson
 * https://github.com/hybrisCole/streamcsvjson.git
 *
 * Copyright (c) 2014 Alberto Cole
 * Licensed under the MIT license.
 */
'use strict';

var program = require('commander'),
    textParse = require('./textParser'),
    fs = require('fs');

program
  .version('0.0.1');

program
  .command('parse <csvPath>')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(csvPath, options){
      //console.log('exec "%s" using %s mode', csvPath, options.exec_mode);
    // This line opens the file as a readable stream
    var readStream = fs.createReadStream('./'+csvPath);
    // This will wait until we know the readable stream is actually valid before piping
    textParse.parseText(readStream);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ streamcsvjson parse file.txt');
    console.log();
  });

program.parse(process.argv);