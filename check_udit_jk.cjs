const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/udit-india.geojson', 'utf8'));

const jk = d.features.filter(f => f.properties.st_nm === 'Jammu and Kashmir').map(f => f.properties.district);
const la = d.features.filter(f => f.properties.st_nm === 'Ladakh').map(f => f.properties.district);

console.log('J&K Districts:', jk);
console.log('Ladakh Districts:', la);
