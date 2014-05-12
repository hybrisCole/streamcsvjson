'use strict';
var Transform = require('stream').Transform,
    parser = new Transform();

parser._transform = function(data, encoding, done) {
  this.push(data);
  done();
};

module.exports.parseText = function(stream){
  stream.pipe(parser).pipe(process.stdout);
}