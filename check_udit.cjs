const fs = require('fs');
const d = JSON.parse(fs.readFileSync('public/udit-india.geojson', 'utf8'));
console.log('Features:', d.features.length);
if (d.features.length > 0) {
  console.log('Props of first feature:', Object.keys(d.features[0].properties));
  const states = [...new Set(d.features.map(f => f.properties.st_nm))];
  console.log('States:', states);
}
