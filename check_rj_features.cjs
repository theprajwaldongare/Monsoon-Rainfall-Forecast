const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/udit-india.geojson', 'utf8'));
const rj = d.features.filter(f => f.properties.st_nm === 'Rajasthan');
console.log('Total RJ features:', rj.length);
console.log('RJ features without district:', rj.filter(f => !f.properties.district).length);
