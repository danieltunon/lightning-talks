const Transform = require('stream').Transform;

class Center extends Transform {
  constructor() {
    super({ objectMode: true });
  }
}

Center.prototype._transform = function(line, encoding, done) {
  line = line.toString();

  const padBefore = Array(Math.ceil((80 - line.length) / 2)).fill(' ').join('');
  const padAfter = Array(Math.floor((80 - line.length) / 2)).fill(' ').join('');

  this.push(`${padBefore}${line}${padAfter}`);
  done();
};

module.exports = {
  Center,
};
