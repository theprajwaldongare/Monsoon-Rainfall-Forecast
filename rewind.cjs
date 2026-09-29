const fs = require('fs');
const rewind = require('@mapbox/geojson-rewind');

// Read the official SOI geojson
const geojson = JSON.parse(fs.readFileSync('public/india-soi.geojson', 'utf8'));

// Enforce RFC 7946 winding order (exterior rings counter-clockwise, interior rings clockwise)
// The second argument `false` means we want the RFC 7946 standard (which D3-geo expects for GeoJSON)
const fixed = rewind(geojson, true);

// Save the fixed geojson
fs.writeFileSync('public/india-fixed.geojson', JSON.stringify(fixed));
console.log('Fixed GeoJSON winding order successfully!');
