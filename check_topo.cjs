const fs = require('fs');
const topojson = require('topojson-client');
const t = JSON.parse(fs.readFileSync('public/india-districts.topo.json', 'utf8'));
const obj = Object.keys(t.objects)[0];
const geo = topojson.feature(t, t.objects[obj]);
console.log('TopoJSON features:', geo.features.length);
console.log('Props in first feature:', geo.features[0].properties);
console.log('Rajasthan features:', geo.features.filter(f => f.properties.NAME_1 === 'Rajasthan').length);
