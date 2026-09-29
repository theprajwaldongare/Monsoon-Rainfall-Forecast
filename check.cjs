const fs = require('fs');
const j = JSON.parse(fs.readFileSync('public/india-soi.geojson', 'utf8'));
console.log('Features:', j.features.length);
console.log('Sample properties:', j.features.slice(0, 5).map(f => f.properties));
