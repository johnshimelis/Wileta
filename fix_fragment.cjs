const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

code = code.replace(/<style>\{\`\.tx-row \{ transition: all 0\.2s; border-radius: 8px; cursor: pointer; \} \.tx-row:hover \{ background: rgba\(0,0,0,0\.02\); transform: translateX\(2px\); \}\`\}<\/style>\r?\n\s*<table/g, '<div style={{ overflowX: "auto" }}><style>{`.tx-row { transition: all 0.2s; border-radius: 8px; cursor: pointer; } .tx-row:hover { background: rgba(0,0,0,0.02); transform: translateX(2px); }`}</style>\n                        <table');
code = code.replace(/<\/table>/g, '</table></div>');

fs.writeFileSync('src/pages/Dashboard.jsx', code);
