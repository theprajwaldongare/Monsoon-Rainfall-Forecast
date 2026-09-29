const fs = require('fs');
const j = JSON.parse(fs.readFileSync('public/india-soi.geojson', 'utf8'));
let coords = j.features[0].geometry.coordinates;
// flatten down to first coordinate pair
while(Array.isArray(coords[0])) {
    coords = coords[0];
}
console.log('Sample coord:', coords);
