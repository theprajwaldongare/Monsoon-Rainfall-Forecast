/**
 * Regenerate district mock data to match the merged TopoJSON.
 * Uses the merged GeoJSON (before simplification) to get correct district list.
 */
const fs = require('fs');

// Read the merged districts (we need to reconstruct from the source data)
const districts = JSON.parse(fs.readFileSync('public/india-districts-raw.geojson', 'utf8'));
const soi = JSON.parse(fs.readFileSync('public/india-fixed.geojson', 'utf8'));

const STATE_ABBR = {
  "Andaman and Nicobar": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR",
  "Assam": "AS", "Bihar": "BR", "Chandigarh": "CH", "Chhattisgarh": "CG",
  "Dadra and Nagar Haveli": "DN", "Daman and Diu": "DD", "Delhi": "DL",
  "Goa": "GA", "Gujarat": "GJ", "Haryana": "HR", "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK", "Jharkhand": "JH", "Karnataka": "KA", "Kerala": "KL",
  "Lakshadweep": "LD", "Madhya Pradesh": "MP", "Maharashtra": "MH", "Manipur": "MN",
  "Meghalaya": "ML", "Mizoram": "MZ", "Nagaland": "NL", "Orissa": "OD", "Odisha": "OD",
  "Puducherry": "PY", "Punjab": "PB", "Rajasthan": "RJ", "Sikkim": "SK",
  "Tamil Nadu": "TN", "Telangana": "TS", "Tripura": "TR", "Uttar Pradesh": "UP",
  "Uttaranchal": "UK", "Uttarakhand": "UK", "West Bengal": "WB", "Ladakh": "LA",
};

const HEAVY_RAIN_STATES = ["Kerala", "Goa", "Maharashtra", "Karnataka"];
const NE_STATES = ["Assam", "Meghalaya", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"];
const COASTAL_STATES = ["Andaman and Nicobar", "Lakshadweep", "Tamil Nadu", "Andhra Pradesh", "Orissa", "West Bengal", "Gujarat", "Puducherry"];
const DRY_STATES = ["Rajasthan", "Chandigarh", "Haryana", "Delhi", "Jammu and Kashmir", "Ladakh"];
const CATS = ["Extremely Heavy", "Very Heavy", "Heavy", "Moderate", "Light"];

let seed = 42;
function rand() { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; }

function pickCategory(state, regime) {
  let weights;
  if (regime === 'active_monsoon') {
    if (HEAVY_RAIN_STATES.includes(state))      weights = [0.30, 0.30, 0.25, 0.10, 0.05];
    else if (NE_STATES.includes(state))          weights = [0.25, 0.30, 0.25, 0.15, 0.05];
    else if (COASTAL_STATES.includes(state))     weights = [0.10, 0.20, 0.30, 0.30, 0.10];
    else if (DRY_STATES.includes(state))         weights = [0.02, 0.05, 0.10, 0.30, 0.53];
    else                                         weights = [0.08, 0.15, 0.25, 0.35, 0.17];
  } else if (regime === 'break_monsoon') {
    if (HEAVY_RAIN_STATES.includes(state) || NE_STATES.includes(state))
                                                 weights = [0.05, 0.10, 0.20, 0.35, 0.30];
    else                                         weights = [0.02, 0.05, 0.10, 0.25, 0.58];
  } else if (regime === 'monsoon_low') {
    if (COASTAL_STATES.includes(state) || HEAVY_RAIN_STATES.includes(state))
                                                 weights = [0.20, 0.25, 0.25, 0.20, 0.10];
    else if (NE_STATES.includes(state))          weights = [0.15, 0.20, 0.25, 0.25, 0.15];
    else                                         weights = [0.05, 0.10, 0.25, 0.35, 0.25];
  } else {
    if (HEAVY_RAIN_STATES.includes(state))       weights = [0.35, 0.30, 0.20, 0.10, 0.05];
    else if (NE_STATES.includes(state))          weights = [0.20, 0.25, 0.30, 0.20, 0.05];
    else if (DRY_STATES.includes(state))         weights = [0.01, 0.03, 0.08, 0.20, 0.68];
    else                                         weights = [0.05, 0.12, 0.20, 0.35, 0.28];
  }
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) { cumulative += weights[i]; if (r < cumulative) return CATS[i]; }
  return CATS[4];
}

function rainfallForCategory(cat) {
  switch (cat) {
    case "Extremely Heavy": return Math.round(160 + rand() * 60);
    case "Very Heavy":      return Math.round(110 + rand() * 50);
    case "Heavy":           return Math.round(60 + rand() * 50);
    case "Moderate":        return Math.round(20 + rand() * 40);
    case "Light":           return Math.round(2 + rand() * 18);
    default:                return Math.round(10 + rand() * 30);
  }
}

// Build district list matching the merged map
const allDistricts = [];

// All non-J&K districts from geohacker
districts.features.forEach(f => {
  if (f.properties.NAME_1 !== 'Jammu and Kashmir') {
    allDistricts.push({ state: f.properties.NAME_1, district: f.properties.NAME_2 });
  }
});

// Add J&K and Ladakh as single entries (matching the merged TopoJSON)
allDistricts.push({ state: "Jammu and Kashmir", district: "Jammu and Kashmir" });
allDistricts.push({ state: "Ladakh", district: "Ladakh" });

console.log(`Total districts: ${allDistricts.length}`);

const regimes = ['active_monsoon', 'break_monsoon', 'monsoon_low', 'orographic'];

let newBlock = `// ─────────────────────────────────────────────\n`;
newBlock += `//  DISTRICT-LEVEL RAINFALL TABLE (${allDistricts.length} districts)\n`;
newBlock += `// ─────────────────────────────────────────────\n`;
newBlock += `const districtsByRegime = {\n`;

regimes.forEach(regime => {
  seed = regime === 'active_monsoon' ? 42 :
         regime === 'break_monsoon' ? 137 :
         regime === 'monsoon_low' ? 293 : 451;
  newBlock += `  ${regime}: [\n`;
  allDistricts.forEach(d => {
    const cat = pickCategory(d.state, regime);
    const rawRain = rainfallForCategory(cat);
    const bias = Math.round(3 + rand() * 12);
    const corrected = Math.max(0, rawRain - bias);
    const obs = Math.max(0, corrected - Math.round(rand() * 5));
    const abbr = STATE_ABBR[d.state] || d.state.substring(0, 2).toUpperCase();
    newBlock += `    { district: ${JSON.stringify(d.district)}, state: ${JSON.stringify(d.state)}, abbr: "${abbr}", raw: ${rawRain}, corrected: ${corrected}, obs: ${obs}, bias: ${bias}, category: "${cat}" },\n`;
  });
  newBlock += `  ],\n`;
});
newBlock += `};\n`;

let code = fs.readFileSync('src/data/mockData.js', 'utf8');
const startMarker = '// ─────────────────────────────────────────────\n//  DISTRICT-LEVEL RAINFALL TABLE';
const startIdx = code.indexOf(startMarker);
if (startIdx === -1) { console.error('Marker not found!'); process.exit(1); }

const afterStart = code.indexOf('const districtsByRegime', startIdx);
let braceDepth = 0, endIdx = -1;
for (let i = code.indexOf('{', afterStart); i < code.length; i++) {
  if (code[i] === '{') braceDepth++;
  if (code[i] === '}') { braceDepth--; if (braceDepth === 0) { endIdx = i + 1; while (endIdx < code.length && (code[endIdx] === ';' || code[endIdx] === '\n')) endIdx++; break; } }
}
if (endIdx === -1) { console.error('End not found!'); process.exit(1); }

code = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
fs.writeFileSync('src/data/mockData.js', code);
console.log(`✅ Updated mockData with ${allDistricts.length} districts × ${regimes.length} regimes`);
