const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
code = code.replace(
    `User, Link as LinkIcon, Settings, Bell, X, AlertCircle, Menu`,
    `User, Link as LinkIcon, Settings, Bell, X, AlertCircle, Menu, Smartphone`
);
fs.writeFileSync('src/pages/Dashboard.jsx', code);
