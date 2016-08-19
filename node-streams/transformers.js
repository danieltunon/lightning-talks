const Transform = require('stream').Transform;
const emojiMap = require('./emoji').keywordMap;

class Center extends Transform {
  constructor() {
    super(/*{ objectMode: true }*/);
  }

  _transform(line, encoding, done) {
    line = line.toString();

    const padBefore = Array(Math.ceil((80 - line.length) / 2)).fill(' ').join('');
    const padAfter = Array(Math.floor((80 - line.length) / 2)).fill(' ').join('');

    this.push(`${padBefore}${line}${padAfter}\n`);
    done();
  }
}

class Emojify extends Transform {
  randomVal(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  emojiReplacer(word) {
    if (emojiMap.has(word)) {
      return String.fromCodePoint(`0x${this.randomVal(emojiMap.get(word))}`) + ' ';
    }
    return word;
  }

  _transform(line, encoding, done) {
    line = line.toString();
    this.push(line);
    this.push(line.split(' ').map(this.emojiReplacer.bind(this)).join(' '));
    done();
  }
}

const Liner = new Transform({
  // objectMode: true,
  highWaterMark: 20,

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
  Emojify,
};
