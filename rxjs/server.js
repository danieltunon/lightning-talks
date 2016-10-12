// const Twit = require('twit');
//
// const T = new Twit({
//   consumer_key: '5kFJFxJ6tJXlNOGoDNzaTPDrT',
//   consumer_secret: 'IOz5G7m2lflfJqahy5Fo6TSxJRoZlHE4BRhystLwkX2EnP2n2G',
//   // app_only_auth: true,
// });
//
// const stream = T.stream('statuses/filter', { track: ['hillary', 'trump'], language: 'en' });
//
// console.log('stream', stream);
//
// stream.on('tweet', function(tweet) {
//   console.log(tweet);
// });
//
// stream.on('message', function(msg) {
//   console.log(msg);
// });
//
// stream.on('error', function(err) {
//   console.log('error', err);
// });
const Transform = require('stream').Transform;

const Liner = new Transform({
  objectMode: true,
  // highWaterMark: 20,

  transform(chunk, encoding, done) {
    let data = chunk.toString();
    data = this._lineFragment ? this._lineFragment + data : data;

    const lines = data.split('\r\n');
    const trailingLine = lines.pop();

    lines.forEach(this.push.bind(this));

    if (data.charAt(data.length - 1) !== '\r\n') {
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
  },
});

const pluck = new Transform({
  objectMode: true,
  transform(c, e, d) {
    const { geo, coordinates, place } = JSON.parse(c);

    if (geo || coordinates || place) {
      this.push(JSON.stringify({ geo, coordinates, place }));
    }
    d();
  },
});

// const open = `
//       ______________________________________________________________________
//      /
//     |
// `;
// const close = `
//     |______________________________________________________________________/\n\n`;
// const pad = '    |   ';
//
// const FormatTweet = new Transform({
//   objectMode: true,
//
//   transform(text, e, d) {
//     let line = [];
//     let dangle = [];
//
//     this.push(open);
//     this.push(pad);
//
//     for (const char of text.toString()) {
//       line.push(char)
//       if (line.length > 50) {
//         dangle.push(char)
//       }
//       if (char == ' ') {
//
//       }
//     }
//     this.push(close);
//     d();
//   },
// });

const addNumberingAndPadding = (() => {
  var count = 1;
  return new Transform({
    objectMode: true,
    transform(c, e, d) {
      this.push('\n');
      this.push(''+count++);
      this.push('\n');
      this.push(c.toString());
      this.push('\n\n');
      d();
    },
  });
})();

process.stdin
  .pipe(Liner)
  .pipe(pluck)
  .pipe(addNumberingAndPadding)
  .pipe(process.stdout);
