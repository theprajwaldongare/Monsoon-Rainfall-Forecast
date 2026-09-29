const fs = require('fs');
const topo = JSON.parse(fs.readFileSync('public/india-highcharts.topo.json', 'utf8'));
const objName = Object.keys(topo.objects)[0];
console.log('Topology object name:', objName);
const features = topo.objects[objName].geometries;
console.log(features.map(f => f.properties.name));
