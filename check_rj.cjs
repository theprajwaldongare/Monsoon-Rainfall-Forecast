const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/udit-india.geojson', 'utf8'));
console.log('Features:', d.features.length);
console.log('Districts in RJ:', d.features.filter(f => f.properties.st_nm === 'Rajasthan').map(f => f.properties.district).slice(0, 10));
