const fs = require('fs');
const j = JSON.parse(fs.readFileSync('public/india-states.geojson', 'utf8'));
console.log('Feature count:', j.features.length);
console.log('First feature properties:', JSON.stringify(j.features[0].properties));
console.log('Sample state names:');
j.features.slice(0,8).forEach(f => console.log(' -', JSON.stringify(f.properties)));
