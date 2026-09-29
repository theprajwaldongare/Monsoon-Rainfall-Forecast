const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/dists11.geojson', 'utf8'));
console.log(d.features.length, 'features');
const jk = d.features.filter(f => f.properties.ST_NM === 'Jammu & Kashmir');
console.log('JK features:', jk.length);
if (jk.length > 0) {
  console.log(jk.map(f => f.properties.DISTRICT));
}
