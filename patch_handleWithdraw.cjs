const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
code = code.replace(
    'const handleWithdraw = async () => {',
    'const handleWithdraw = async (selectedBankAccount) => {'
);
code = code.replace(
    "const res = await api.post('/dashboard/withdraw', { amount });",
    "const res = await api.post('/dashboard/withdraw', { amount, payoutMethod: user?.payoutMethod, payoutDestination: selectedBankAccount || (user?.telebirr_number || user?.phone) });"
);
fs.writeFileSync('src/pages/Dashboard.jsx', code);
