const fs = require('fs');
const t = JSON.parse(fs.readFileSync('public/india-districts.topo.json', 'utf8'));
console.log(Object.keys(t.objects));
