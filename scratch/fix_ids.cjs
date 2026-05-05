const fs = require('fs');

let content = fs.readFileSync('src/data.js', 'utf8');

for (let i = 1; i <= 14; i++) {
  const oldKey = `"p${i}"`;
  const newKey = `"WC${String(i).padStart(3, '0')}"`;
  content = content.replace(new RegExp(oldKey, 'g'), newKey);
}

for (let i = 1; i <= 9; i++) {
  const oldReq = `"REQ-${String(i).padStart(3, '0')}"`;
  const newReq = `"WC${String(10 + i).padStart(3, '0')}"`;
  content = content.replace(new RegExp(oldReq, 'g'), newReq);
}

fs.writeFileSync('src/data.js', content);
console.log("Done");
