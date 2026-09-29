const fs = require('fs');

const geojson = JSON.parse(fs.readFileSync('public/udit-india.geojson', 'utf8'));

// Filter out state-level polygons (they lack a district name/dt_code)
geojson.features = geojson.features.filter(f => f.properties.district || f.properties.dt_code);

const STATE_ABBR = {
  "Andaman and Nicobar Islands": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR",
  "Assam": "AS", "Bihar": "BR", "Chandigarh": "CH", "Chhattisgarh": "CG",
  "Dadra and Nagar Haveli and Daman and Diu": "DN", "Delhi": "DL",
  "Goa": "GA", "Gujarat": "GJ", "Haryana": "HR", "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK", "Jharkhand": "JH", "Karnataka": "KA", "Kerala": "KL",
  "Lakshadweep": "LD", "Madhya Pradesh": "MP", "Maharashtra": "MH", "Manipur": "MN",
  "Meghalaya": "ML", "Mizoram": "MZ", "Nagaland": "NL", "Odisha": "OD",
  "Puducherry": "PY", "Punjab": "PB", "Rajasthan": "RJ", "Sikkim": "SK",
  "Tamil Nadu": "TN", "Telangana": "TS", "Tripura": "TR", "Uttar Pradesh": "UP",
  "Uttarakhand": "UK", "West Bengal": "WB", "Ladakh": "LA",
};

const HEAVY_RAIN_STATES = ["Kerala", "Goa", "Maharashtra", "Karnataka"];
const NE_STATES = ["Assam", "Meghalaya", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"];
const COASTAL_STATES = ["Andaman and Nicobar Islands", "Lakshadweep", "Tamil Nadu", "Andhra Pradesh", "Odisha", "West Bengal", "Gujarat", "Puducherry"];
const DRY_STATES = ["Rajasthan", "Chandigarh", "Haryana", "Delhi", "Jammu and Kashmir", "Ladakh", "Punjab"];

const CATS = ["Extremely Heavy", "Very Heavy", "Heavy", "Moderate", "Light"];

let seed = 42;
function rand() { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; }
function normalRand(mean, stdDev) {
  let u = 1 - rand();
  let v = rand();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

function pickCategory(state, district, regime) {
  let weights;
  if (regime === 'active_monsoon') {
    if (HEAVY_RAIN_STATES.includes(state))      weights = [0.20, 0.30, 0.30, 0.15, 0.05];
    else if (NE_STATES.includes(state))         weights = [0.15, 0.25, 0.35, 0.20, 0.05];
    else if (COASTAL_STATES.includes(state))    weights = [0.05, 0.15, 0.35, 0.35, 0.10];
    else if (DRY_STATES.includes(state))        weights = [0.00, 0.02, 0.10, 0.35, 0.53];
    else                                        weights = [0.02, 0.10, 0.25, 0.45, 0.18];
  } else if (regime === 'break_monsoon') {
    if (HEAVY_RAIN_STATES.includes(state) || NE_STATES.includes(state))
                                                weights = [0.05, 0.10, 0.25, 0.35, 0.25];
    else                                        weights = [0.00, 0.02, 0.10, 0.30, 0.58];
  } else if (regime === 'monsoon_low') {
    if (COASTAL_STATES.includes(state) || HEAVY_RAIN_STATES.includes(state))
                                                weights = [0.15, 0.25, 0.30, 0.20, 0.10];
    else if (NE_STATES.includes(state))         weights = [0.10, 0.20, 0.30, 0.30, 0.10];
    else                                        weights = [0.02, 0.08, 0.20, 0.40, 0.30];
  } else {
    if (HEAVY_RAIN_STATES.includes(state))      weights = [0.25, 0.30, 0.25, 0.15, 0.05];
    else if (NE_STATES.includes(state))         weights = [0.10, 0.20, 0.30, 0.30, 0.10];
    else if (DRY_STATES.includes(state))        weights = [0.00, 0.01, 0.05, 0.25, 0.69];
    else                                        weights = [0.02, 0.10, 0.20, 0.40, 0.28];
  }
  
  // We don't want the entire state to just randomly distribute independently,
  // but we DO want adjacent districts to sometimes have different colors.
  // We'll use a random roll specifically for this district.
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return CATS[i];
  }
  return CATS[4];
}

function rainfallForCategory(cat) {
  let val = 0;
  switch (cat) {
    case "Extremely Heavy": val = normalRand(230, 20); break;
    case "Very Heavy":      val = normalRand(160, 20); break;
    case "Heavy":           val = normalRand(90, 15); break;
    case "Moderate":        val = normalRand(40, 12); break;
    case "Light":           val = normalRand(9, 3); break;
  }
  return Math.max(1, Math.round(val * 10) / 10);
}

const allDistricts = geojson.features.map(f => {
  let dist = f.properties.district;
  let state = f.properties.st_nm;
  if (dist === undefined && state === 'Jammu and Kashmir') dist = 'Other J&K';
  if (dist === undefined && state === 'Ladakh') dist = 'Aksai Chin / Other Ladakh';
  if (!dist) dist = 'Unknown';
  return { state, district: dist };
});

const uniqueDistrictsMap = new Map();
allDistricts.forEach(d => uniqueDistrictsMap.set(d.state + '|' + d.district, d));
const uniqueDistricts = Array.from(uniqueDistrictsMap.values());

const regimes = ['active_monsoon', 'break_monsoon', 'monsoon_low', 'orographic'];

let newBlock = `// ─────────────────────────────────────────────\n`;
newBlock += `//  DISTRICT-LEVEL RAINFALL TABLE (${uniqueDistricts.length} districts - Simulated Historical Data)\n`;
newBlock += `// ─────────────────────────────────────────────\n`;
newBlock += `const districtsByRegime = {\n`;

regimes.forEach(regime => {
  // Use a string-based hash so each district gets a consistent pseudorandom value
  seed = regime === 'active_monsoon' ? 42 : regime === 'break_monsoon' ? 137 : regime === 'monsoon_low' ? 293 : 451;

  newBlock += `  ${regime}: [\n`;
  uniqueDistricts.forEach((d) => {
    // Generate a unique seed for this district to ensure random variation across districts
    for(let i=0; i<d.district.length; i++) rand();
    
    const cat = pickCategory(d.state, d.district, regime);
    const obs = rainfallForCategory(cat);
    const rawErrorMod = (cat === 'Extremely Heavy' || cat === 'Very Heavy') ? normalRand(1.2, 0.15) : normalRand(0.9, 0.15);
    const rawRain = Math.max(0, Math.round((obs * rawErrorMod) * 10) / 10);
    const correctionFactor = normalRand(0.8, 0.1); 
    const rawBias = rawRain - obs;
    const correctedRain = Math.max(0, Math.round((rawRain - (rawBias * correctionFactor)) * 10) / 10);
    const finalBias = Math.round((correctedRain - obs) * 10) / 10;
    
    const abbr = STATE_ABBR[d.state] || d.state.substring(0, 2).toUpperCase();
    newBlock += `    { district: ${JSON.stringify(d.district)}, state: ${JSON.stringify(d.state)}, abbr: "${abbr}", raw: ${rawRain}, corrected: ${correctedRain}, obs: ${obs}, bias: ${finalBias}, category: "${cat}" },\n`;
  });
  newBlock += `  ],\n`;
});
newBlock += `};\n`;

let code = fs.readFileSync('src/data/mockData.js', 'utf8');
const startMarker = '// ─────────────────────────────────────────────\n//  DISTRICT-LEVEL RAINFALL TABLE';
const startIdx = code.indexOf(startMarker);
const afterStart = code.indexOf('const districtsByRegime', startIdx);
let braceDepth = 0; let endIdx = -1;
for (let i = code.indexOf('{', afterStart); i < code.length; i++) {
  if (code[i] === '{') braceDepth++;
  if (code[i] === '}') {
    braceDepth--;
    if (braceDepth === 0) {
      endIdx = i + 1;
      while (endIdx < code.length && (code[endIdx] === ';' || code[endIdx] === '\n')) endIdx++;
      break;
    }
  }
}
code = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
fs.writeFileSync('src/data/mockData.js', code);
console.log(`✅ Generated varied district-level data for ${uniqueDistricts.length} districts`);
