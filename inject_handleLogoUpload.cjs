const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

if (!code.includes('const handleLogoUpload = async')) {
    const uploadHandler = `
    const handleLogoUpload = async (file, accountIndex) => {
        try {
            const formData = new FormData();
            formData.append('logo', file);
            const res = await api.post('/auth/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.logoUrl) {
                const newAccounts = [...bankAccounts];
                if (accountIndex === -1) {
                    setNewAccount({...newAccount, logoUrl: res.data.logoUrl});
                } else {
                    newAccounts[accountIndex].logoUrl = res.data.logoUrl;
                    setBankAccounts(newAccounts);
                }
            }
        } catch (error) {
            console.error('Failed to upload logo to S3', error);
            alert('Failed to upload logo');
        }
    };
    `;
    code = code.replace('const handleSavePayoutSettings = async', uploadHandler + '\n    const handleSavePayoutSettings = async');
    fs.writeFileSync('src/pages/Dashboard.jsx', code);
}
