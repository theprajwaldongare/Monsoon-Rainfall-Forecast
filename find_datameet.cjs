const fs = require('fs');

async function run() {
  const res = await fetch('https://api.github.com/repos/datameet/maps/git/trees/master?recursive=1');
  const data = await res.json();
  const files = data.tree ? data.tree.filter(t => t.path.endsWith('.geojson') || t.path.endsWith('.json')) : [];
  files.forEach(f => console.log(f.path));
}
run();
