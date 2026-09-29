const fs = require('fs');
let code = fs.readFileSync('src/data/mockData.js', 'utf8');

const states = [
  "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "UP", "Uttarakhand", "West Bengal", "Ladakh"
];

const cats = ["Extremely Heavy", "Very Heavy", "Heavy", "Moderate", "Light", "Light", "Moderate"];

const regimes = ['active_monsoon', 'break_monsoon', 'monsoon_low', 'orographic'];
let newDict = "const districtsByRegime = {\n";

regimes.forEach((reg, i) => {
  newDict += `  ${reg}: [\n`;
  states.forEach((st, j) => {
    let r = (i * 7 + j * 13) % 200 + 10;
    let corr = Math.round(r * 0.85);
    
    // Actually vary the categories using a non-multiple of 7
    let cat = cats[(i * 3 + j * 5) % cats.length];
    
    // Special realistic touches for Active Monsoon: Western Ghats and NE get Heavy, others vary
    if (reg === 'active_monsoon') {
        if (['Kerala', 'Goa', 'Maharashtra', 'Assam', 'Meghalaya'].includes(st)) {
            cat = "Extremely Heavy";
        } else if (['Karnataka', 'Gujarat', 'Arunachal Pradesh', 'Bihar'].includes(st)) {
            cat = "Very Heavy";
        } else if (['Rajasthan', 'Delhi', 'Haryana'].includes(st)) {
            cat = "Light";
        }
    }
    
    let districtName = st === 'Delhi' ? 'New Delhi' : st + ' City';
    newDict += `    { district: "${districtName}", state: "${st}", raw: ${r}, corrected: ${corr}, obs: ${corr-2}, bias: 2, category: "${cat}" },\n`;
  });
  newDict += `  ],\n`;
});
newDict += "};";

code = code.replace(/const districtsByRegime = \{[\s\S]*?\};\n/, newDict + '\n');
fs.writeFileSync('src/data/mockData.js', code);
console.log('mockData keys fixed properly');
