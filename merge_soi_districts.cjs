/**
 * Merge district GeoJSON with SOI state boundaries for complete Kashmir/Ladakh.
 * - Take all district features from geohacker dataset
 * - Replace J&K districts with the full SOI boundary (which includes PoK, Aksai Chin)
 * - Add Ladakh from SOI if not present
 * - Rewind + simplify -> TopoJSON
 */
const fs = require('fs');
const rewind = require('@mapbox/geojson-rewind');
const mapshaper = require('mapshaper');

console.log('Reading files...');
const districts = JSON.parse(fs.readFileSync('public/india-districts-raw.geojson', 'utf8'));
const soi = JSON.parse(fs.readFileSync('public/india-fixed.geojson', 'utf8'));

console.log(`Districts: ${districts.features.length} features`);
console.log(`SOI states: ${soi.features.length} features`);

// Get the SOI features for J&K and Ladakh (complete boundaries)
const soiJK = soi.features.find(f => {
  const name = f.properties.STNAME_SH || f.properties.STNAME || '';
  return name.includes('Jammu') || name.includes('Kashmir');
});
const soiLadakh = soi.features.find(f => {
  const name = f.properties.STNAME_SH || f.properties.STNAME || '';
  return name.includes('Ladakh');
});

console.log('SOI J&K found:', soiJK ? soiJK.properties.STNAME_SH : 'NOT FOUND');
console.log('SOI Ladakh found:', soiLadakh ? soiLadakh.properties.STNAME_SH : 'NOT FOUND');

// Remove J&K districts from the district dataset (they have incomplete boundaries)
const filteredDistricts = districts.features.filter(f => {
  const state = f.properties.NAME_1 || '';
  return state !== 'Jammu and Kashmir';
});

console.log(`After removing J&K districts: ${filteredDistricts.length} features`);

// Create replacement features for J&K with district-compatible properties
const replacements = [];

if (soiJK) {
  // Add J&K as a single "district" with SOI boundaries
  replacements.push({
    type: "Feature",
    properties: {
      ID_0: 105, ISO: "IND", NAME_0: "India",
      ID_1: 15, NAME_1: "Jammu and Kashmir",
      ID_2: 9000, NAME_2: "Jammu and Kashmir",
      TYPE_2: "State", ENGTYPE_2: "State"
    },
    geometry: soiJK.geometry
  });
}

if (soiLadakh) {
  // Add Ladakh as a single "district" with SOI boundaries
  replacements.push({
    type: "Feature",
    properties: {
      ID_0: 105, ISO: "IND", NAME_0: "India",
      ID_1: 37, NAME_1: "Ladakh",
      ID_2: 9001, NAME_2: "Ladakh",
      TYPE_2: "Union Territory", ENGTYPE_2: "Union Territory"
    },
    geometry: soiLadakh.geometry
  });
}

// Merge
const merged = {
  type: "FeatureCollection",
  features: [...filteredDistricts, ...replacements]
};

console.log(`Merged total: ${merged.features.length} features`);

// Fix winding order
console.log('Fixing winding order...');
const fixed = rewind(merged, true);

const tempPath = 'public/india-districts-merged-temp.geojson';
fs.writeFileSync(tempPath, JSON.stringify(fixed));
console.log(`Temp file: ${(fs.statSync(tempPath).size / 1024 / 1024).toFixed(1)} MB`);

// Simplify with mapshaper -> TopoJSON
console.log('Simplifying (10% detail) -> TopoJSON...');
const output = mapshaper.applyCommands(
  `-i ${tempPath} -simplify 10% keep-shapes -o format=topojson`
).then(result => {
  const topoContent = Object.values(result)[0];
  fs.writeFileSync('public/india-districts.topo.json', topoContent);
  const size = fs.statSync('public/india-districts.topo.json').size;
  console.log(`Output: ${(size / 1024 / 1024).toFixed(1)} MB`);
  
  // Verify
  const topo = JSON.parse(fs.readFileSync('public/india-districts.topo.json', 'utf8'));
  const objName = Object.keys(topo.objects)[0];
  console.log(`TopoJSON object: "${objName}", geometries: ${topo.objects[objName].geometries.length}`);
  
  // Check J&K/Ladakh presence
  const names = topo.objects[objName].geometries.map(g => g.properties.NAME_1);
  const hasJK = names.includes('Jammu and Kashmir');
  const hasLadakh = names.includes('Ladakh');
  console.log(`J&K present: ${hasJK}, Ladakh present: ${hasLadakh}`);
  
  fs.unlinkSync(tempPath);
  console.log('Done!');
}).catch(e => { console.error(e); process.exit(1); });
