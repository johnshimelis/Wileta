const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// The main layout cards have border: 1px solid var(--border-color) but maybe there's a heavy shadow or something
// We can change borders to be more subtle and remove the custom thick color stripes in Bank Accounts

// Replace thick bank color stripe (4px) with a subtle left border or background tint
code = code.replace(/<div style=\{\{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: getBankColor\(account\.bankName\) \}\}><\/div>/g, 
    '<div style={{ position: \'absolute\', top: 0, left: 0, bottom: 0, width: \'4px\', background: getBankColor(account.bankName), opacity: 0.7 }}></div>');

// Replace "border: '2px solid var(--primary)'" if it exists, or just ensure cards use subtle borders
code = code.replace(/border: '1px solid var\(--border-color\)', borderRadius: '1rem'/g, 
    "border: '1px solid rgba(0,0,0,0.05)', borderRadius: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'");

code = code.replace(/border: '1px solid var\(--border-color\)', borderRadius: '0\.75rem'/g, 
    "border: '1px solid rgba(0,0,0,0.05)', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'");

code = code.replace(/border: '1px solid var\(--border-color\)', borderRadius: '12px'/g, 
    "border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'");

code = code.replace(/boxShadow: 'var\(--shadow-sm\)'/g, "boxShadow: '0 2px 8px rgba(0,0,0,0.04)'");

code = code.replace(/background: 'var\(--card-bg\)'/g, "background: 'var(--card-bg)'");

fs.writeFileSync('src/pages/Dashboard.jsx', code);
