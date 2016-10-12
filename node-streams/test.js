const { Liner, Center, Emojify } = require('./transformers');

process.stdin.pipe(Liner).pipe(new Emojify()).pipe(new Center()).pipe(process.stdout);
