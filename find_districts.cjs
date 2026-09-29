const fs = require('fs');

async function run() {
  const res = await fetch('https://api.github.com/repos/udit-001/india-maps-data/git/trees/main?recursive=1');
  const data = await res.json();
  const files = data.tree.filter(t => t.path.endsWith('.geojson') || t.path.endsWith('.json'));
  files.forEach(f => console.log(f.path));
}
run();
