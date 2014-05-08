#! /usr/bin/env node
/*
 * streamcsvjson
 * https://github.com/hybrisCole/streamcsvjson.git
 *
 * Copyright (c) 2014 Alberto Cole
 * Licensed under the MIT license.
 */

'use strict';

var program = require('commander');

exports.awesome = function() {
  return 'awesome';
};

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

console.log('you ordered a pizza with:');
if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbq) console.log('  - bbq');
console.log('  - %s cheese', program.cheese);
