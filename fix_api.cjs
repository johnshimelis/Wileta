const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicProfile.jsx', 'utf8');
code = code.replace("import api from '../services/api';", "import { useAuth } from '../context/AuthContext';");
code = code.replace("const { username } = useParams();", "const { username } = useParams();\n    const { api } = useAuth();");
code = code.replace("}, [username]);", "}, [username, api]);");
code = code.replace("}, [tippingState, txRef]);", "}, [tippingState, txRef, api]);");
fs.writeFileSync('src/pages/PublicProfile.jsx', code);
