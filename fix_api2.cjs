const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicProfile.jsx', 'utf8');
code = code.replace("const { username } = useParams();\n    const { api } = useAuth();", "const { username } = useParams();");
fs.writeFileSync('src/pages/PublicProfile.jsx', code);
