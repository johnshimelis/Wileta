const fs = require('fs');
const content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
let newContent = content.replace(
    "const payload = {\n                payoutMethod,\n                bankDetails: payoutMethod === 'bank' ? {\n                    bankName,\n                    accountNumber,\n                    accountHolderName\n                } : undefined\n            };",
    "const payload = {\n                payoutMethod,\n                bankAccounts: payoutMethod === 'bank' ? bankAccounts : undefined\n            };"
);
fs.writeFileSync('src/pages/Dashboard.jsx', newContent);
