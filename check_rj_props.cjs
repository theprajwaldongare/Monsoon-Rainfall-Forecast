const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/udit-india.geojson', 'utf8'));
const rj = d.features.filter(f => f.properties.st_nm === 'Rajasthan');
console.log(rj.slice(0, 2).map(f => f.properties));
