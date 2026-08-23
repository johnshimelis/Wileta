const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
if (!code.includes("import api from '../utils/api';")) {
    code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport api from '../utils/api';");
    fs.writeFileSync('src/pages/Dashboard.jsx', code);
    console.log("Added api import to Dashboard.jsx");
}

let settingsCode = fs.readFileSync('src/pages/Settings.jsx', 'utf8');
if (!settingsCode.includes("import api from '../utils/api';")) {
    settingsCode = settingsCode.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport api from '../utils/api';");
    settingsCode = settingsCode.replace("const { user, setUser, api, logout } = useAuth();", "const { user, setUser, logout } = useAuth();");
    fs.writeFileSync('src/pages/Settings.jsx', settingsCode);
    console.log("Fixed api in Settings.jsx");
}
