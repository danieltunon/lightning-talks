const Transform = require('stream').Transform;

class Center extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(line, encoding, done) {
    line = line.toString();

    const padBefore = Array(Math.ceil((80 - line.length) / 2)).fill(' ').join('');
    const padAfter = Array(Math.floor((80 - line.length) / 2)).fill(' ').join('');

    this.push(`${padBefore}${line}${padAfter}\n`);
    done();
  }
}


const Liner = new Transform({
  objectMode: true,

  transform(chunk, encoding, done) {
    let data = chunk.toString();
    data = this._lineFragment ? this._lineFragment + data : data;

    const lines = data.split('\n');
    const trailingLine = lines.pop();

    lines.forEach(this.push.bind(this));

    if (data.charAt(data.length - 1) !== '\n') {
      this._lineFragment = trailingLine;
    } else {
      this.push(`${trailingLine}`);
      this._trailingLine = '';
    }
    done();
  },

  flush(done) {
    if (this._lineFragment) this.push(this._lineFragment);
    this._lineFragment = '';
    done();
  }
});

module.exports = {
  Center,
  Liner,
};
