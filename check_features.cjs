const fs = require('fs');
const j = JSON.parse(fs.readFileSync('./public/india-soi.geojson', 'utf8'));
console.log(j.features.map(f => f.properties.STNAME_SH));
