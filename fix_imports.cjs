const fs = require('fs');

let code = fs.readFileSync('src/pages/Signup.jsx', 'utf8');
if (!code.includes('Phone, ')) {
    code = code.replace("import { Mail, Lock, User, AlertCircle }", "import { Mail, Lock, User, AlertCircle, Phone }");
    fs.writeFileSync('src/pages/Signup.jsx', code);
    console.log("Fixed Signup.jsx");
}

let loginCode = fs.readFileSync('src/pages/Login.jsx', 'utf8');
if (!loginCode.includes('Phone')) {
    loginCode = loginCode.replace("import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Send }", "import { Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Send }");
    fs.writeFileSync('src/pages/Login.jsx', loginCode);
    console.log("Fixed Login.jsx");
}
