const fs = require('fs');
const topojson = require('topojson-server');

const geojson = JSON.parse(fs.readFileSync('public/india-soi.geojson', 'utf8'));
const topology = topojson.topology({ india: geojson });
fs.writeFileSync('public/india.topo.json', JSON.stringify(topology));
console.log('TopoJSON created successfully!');
