const fs = require('fs');
const content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
let newContent = content.replace(
    const payload = {
                payoutMethod,
                bankDetails: payoutMethod === 'bank' ? {
                    bankName,
                    accountNumber,
                    accountHolderName
                } : undefined
            };,
    const payload = {
                payoutMethod,
                bankAccounts: payoutMethod === 'bank' ? bankAccounts : undefined
            };
);
fs.writeFileSync('src/pages/Dashboard.jsx', newContent);
