const fs = require('fs');
const path = require('path');
const r = require('ramda');

const formatEmoji = r.map((data) => [data.unicode.toUpperCase(), data.keywords]);
const parsed = formatEmoji(r.values(JSON.parse(fs.readFileSync(path.join(__filename, '../../emoji.json'), 'utf8'))));


const keywordMap = new Map();

function updateMap(key, val, map) {
  val = /-/.test(val) ? val.split('-')[1] : val;
  if (map.has(key)) {
    map.set(key, map.get(key).concat(val));
  } else {
    map.set(key, [val]);
  }
}

for (const [unicode, keywords] of parsed) {
  keywords.forEach(keyword => updateMap(keyword, unicode, keywordMap));
}
// process.stdout.write(JSON.stringify(Array.from(keywordMap.entries())));

module.exports = {
  keywordMap,
};
