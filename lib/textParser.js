'use strict';
var Transform = require('stream').Transform,
    parser = new Transform();

parser._transform = function(data, encoding, done) {
  var extraSringRemoved = data.toString('utf-8').replace(new RegExp('[ ]{2,}', 'g'), ',');
  this.push(new Buffer(extraSringRemoved, 'utf-8'));
  done();
};

module.exports.parseText = function(stream){
  stream.pipe(parser).pipe(process.stdout);
}

// Some programs like `head` send an error on stdout
// when they don't want any more data
process.stdout.on('error', process.exit);