const fs = require('fs');
const geojson = JSON.parse(fs.readFileSync('public/india-fixed.geojson', 'utf8'));
console.log('Type:', geojson.type);
console.log('Feature count:', geojson.features.length);
console.log('Sample properties (first 3):');
geojson.features.slice(0, 3).forEach((f, i) => {
  console.log(`  [${i}]`, JSON.stringify(f.properties));
});
