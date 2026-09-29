const fs = require('fs');
const rewind = require('@mapbox/geojson-rewind');
const mapshaper = require('mapshaper');

async function main() {
  console.log('Reading raw district GeoJSON...');
  const raw = JSON.parse(fs.readFileSync('public/india-districts-raw.geojson', 'utf8'));
  console.log(`  ${raw.features.length} districts found`);

  console.log('Fixing winding order...');
  const fixed = rewind(raw, true);
  
  const tempPath = 'public/india-districts-temp.geojson';
  fs.writeFileSync(tempPath, JSON.stringify(fixed));
  console.log(`  Temp file: ${(fs.statSync(tempPath).size / 1024 / 1024).toFixed(1)} MB`);

  console.log('Simplifying with mapshaper (10% detail) -> TopoJSON...');
  const output = await mapshaper.applyCommands(
    `-i public/india-districts-temp.geojson -simplify 10% keep-shapes -o format=topojson`
  );
  
  // mapshaper returns the output in memory
  const topoContent = Object.values(output)[0];
  fs.writeFileSync('public/india-districts.topo.json', topoContent);
  const topoSize = fs.statSync('public/india-districts.topo.json').size;
  console.log(`  Output TopoJSON: ${(topoSize / 1024 / 1024).toFixed(1)} MB`);

  fs.unlinkSync(tempPath);
  
  const topo = JSON.parse(fs.readFileSync('public/india-districts.topo.json', 'utf8'));
  const objName = Object.keys(topo.objects)[0];
  const geomCount = topo.objects[objName].geometries.length;
  console.log(`  Object: "${objName}", geometries: ${geomCount}`);
  
  // Show sample properties
  const sample = topo.objects[objName].geometries[0].properties;
  console.log(`  Sample properties: ${JSON.stringify(sample)}`);
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
