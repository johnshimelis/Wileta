const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
code = code.replace("import api from '../utils/api';\r\n", "");
fs.writeFileSync('src/pages/Dashboard.jsx', code);

let settingsCode = fs.readFileSync('src/pages/Settings.jsx', 'utf8');
settingsCode = settingsCode.replace("import api from '../utils/api';\r\n", "");
settingsCode = settingsCode.replace("const { user, setUser, logout } = useAuth();", "const { user, setUser, api, logout } = useAuth();");
fs.writeFileSync('src/pages/Settings.jsx', settingsCode);

console.log("Removed bad api import");
