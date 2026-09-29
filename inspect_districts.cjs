const fs = require('fs');
const geojson = JSON.parse(fs.readFileSync('public/india-districts-raw.geojson', 'utf8'));
console.log('Type:', geojson.type);
console.log('Feature count:', geojson.features.length);
console.log('Sample properties (first 3):');
geojson.features.slice(0, 3).forEach((f, i) => {
  console.log(`  [${i}]`, JSON.stringify(f.properties));
});
console.log('Sample properties (last 2):');
geojson.features.slice(-2).forEach((f, i) => {
  console.log(`  [${geojson.features.length - 2 + i}]`, JSON.stringify(f.properties));
});
// Collect unique state names
const states = new Set();
geojson.features.forEach(f => {
  const st = f.properties.ST_NM || f.properties.state || f.properties.STATE || f.properties.NAME_1 || '';
  if (st) states.add(st);
});
console.log('Unique states:', states.size, [...states].sort());
