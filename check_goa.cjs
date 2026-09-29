const t = require('topojson-client');
const j = require('./public/india-highcharts.topo.json');
const feat = t.feature(j, j.objects.default);
const goa = feat.features.find(f => f.properties.name === 'Goa');
console.log(goa.geometry.coordinates[0][0][0]);
