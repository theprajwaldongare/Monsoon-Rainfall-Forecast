const fs = require('fs');
const rewind = require('@mapbox/geojson-rewind');
const mapshaper = require('mapshaper');

console.log('Reading udit map...');
const geojson = JSON.parse(fs.readFileSync('public/udit-india.geojson', 'utf8'));

console.log(`Original features: ${geojson.features.length}`);

// Filter out state-level polygons (they lack a district name/dt_code)
geojson.features = geojson.features.filter(f => f.properties.district || f.properties.dt_code);

console.log(`Features after removing state polygons: ${geojson.features.length}`);

// Standardize property names to NAME_1 (state) and NAME_2 (district)
geojson.features.forEach(f => {
  if (f.properties.district === undefined && f.properties.st_nm === 'Jammu and Kashmir') f.properties.district = 'Other J&K';
  if (f.properties.district === undefined && f.properties.st_nm === 'Ladakh') f.properties.district = 'Aksai Chin / Other Ladakh';
  if (!f.properties.district) f.properties.district = 'Unknown';
  
  f.properties.NAME_1 = f.properties.st_nm;
  f.properties.NAME_2 = f.properties.district;
});

// Fix winding order just in case
console.log('Fixing winding order...');
const fixed = rewind(geojson, true);

const tempPath = 'public/india-districts-merged-temp.geojson';
fs.writeFileSync(tempPath, JSON.stringify(fixed));

// Simplify with mapshaper -> TopoJSON
console.log('Simplifying (10% detail) -> TopoJSON...');
mapshaper.applyCommands(
  `-i ${tempPath} -simplify 10% keep-shapes -o format=topojson`
).then(result => {
  const topoContent = Object.values(result)[0];
  fs.writeFileSync('public/india-districts-v2.topo.json', topoContent);
  const size = fs.statSync('public/india-districts-v2.topo.json').size;
  console.log(`Output: ${(size / 1024 / 1024).toFixed(1)} MB`);
  fs.unlinkSync(tempPath);
  console.log('Done!');
}).catch(e => { console.error(e); process.exit(1); });
