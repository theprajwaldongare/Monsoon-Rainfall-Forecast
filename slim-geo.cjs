const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('public/india-states.geojson', 'utf8'));

// 3 decimal places = ~111m precision
function roundCoords(coords, depth = 0) {
  if (typeof coords[0] === 'number') {
    return [Math.round(coords[0] * 1000) / 1000, Math.round(coords[1] * 1000) / 1000];
  }
  return coords.map(c => roundCoords(c, depth + 1));
}

const slim = {
  type: raw.type,
  features: raw.features.map(f => ({
    type: f.type,
    properties: { NAME_1: f.properties.NAME_1 },
    geometry: {
      type: f.geometry.type,
      coordinates: roundCoords(f.geometry.coordinates),
    }
  }))
};

fs.writeFileSync('public/india-states-slim.json', JSON.stringify(slim));
const size = fs.statSync('public/india-states-slim.json').size;
console.log('Slim file written:', Math.round(size/1024), 'KB');
