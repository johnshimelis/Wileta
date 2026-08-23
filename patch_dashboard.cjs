const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// 1. Remove the old base64 uploader I added
code = code.replace(/<div style=\{\{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' \}\}>[\s\S]*?<\/div>/g, '');

// 2. Add the AWS S3 upload handler to Dashboard.jsx
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
    code = code.replace('const handleSavePayoutDetails = async', uploadHandler + '\n    const handleSavePayoutDetails = async');
}

// 3. Replace the logo circle for mapped accounts with a clickable one
const mappedLogoDiv = `
<div style={{
    width: '40px', height: '40px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', flexShrink: 0
}}>
    {getBankInitials(account.bankName)}
</div>`;
const newMappedLogoDiv = `
<label style={{ cursor: 'pointer', position: 'relative' }}>
    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => { if(e.target.files[0]) handleLogoUpload(e.target.files[0], index); }} />
    <div style={{
        width: '40px', height: '40px',
        borderRadius: '50%',
        background: 'var(--primary)',
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', flexShrink: 0,
        backgroundImage: account.logoUrl ? \`url(\${account.logoUrl})\` : 'none',
        backgroundSize: 'cover', backgroundPosition: 'center',
        overflow: 'hidden'
    }}>
        {!account.logoUrl && getBankInitials(account.bankName)}
    </div>
    <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'white', borderRadius: '50%', padding: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
    </div>
</label>`;
code = code.replace(mappedLogoDiv, newMappedLogoDiv);
code = code.replace(mappedLogoDiv.replace('account.bankName', 'account.bankName'), newMappedLogoDiv); // Just in case

// 4. Replace the logo circle for new account with a clickable one
const newAccountLogoDiv = `
<div style={{
    width: '40px', height: '40px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', flexShrink: 0
}}>
    {getBankInitials(newAccount.bankName)}
</div>`;
const newNewAccountLogoDiv = `
<label style={{ cursor: 'pointer', position: 'relative' }}>
    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => { if(e.target.files[0]) handleLogoUpload(e.target.files[0], -1); }} />
    <div style={{
        width: '40px', height: '40px',
        borderRadius: '50%',
        background: 'var(--primary)',
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', flexShrink: 0,
        backgroundImage: newAccount.logoUrl ? \`url(\${newAccount.logoUrl})\` : 'none',
        backgroundSize: 'cover', backgroundPosition: 'center',
        overflow: 'hidden'
    }}>
        {!newAccount.logoUrl && getBankInitials(newAccount.bankName)}
    </div>
    <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'white', borderRadius: '50%', padding: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
    </div>
</label>`;
code = code.replace(newAccountLogoDiv, newNewAccountLogoDiv);

fs.writeFileSync('src/pages/Dashboard.jsx', code);
