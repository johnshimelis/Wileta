const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// The problematic snippet is around line 811
code = code.replace(/\/>\s*\/>/g, '/>');

fs.writeFileSync('src/pages/Dashboard.jsx', code);
