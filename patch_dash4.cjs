const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// 1. Inject handleLogoUpload if not exists
if (!code.includes('const handleLogoUpload')) {
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
}

// 2. Add Edit Icon to the Bank Initials Circle
const circleTarget = `                                                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                                          {getBankInitials(account.bankName)}
                                                      </div>`;

const circleReplacement = `
                                                      <label style={{ cursor: 'pointer', position: 'relative' }}>
                                                          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => { if(e.target.files[0]) handleLogoUpload(e.target.files[0], index); }} />
                                                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundImage: account.logoUrl ? \`url(\${account.logoUrl})\` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                                              {!account.logoUrl && getBankInitials(account.bankName)}
                                                          </div>
                                                          <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'white', borderRadius: '50%', padding: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                          </div>
                                                      </label>`;

code = code.replace(circleTarget, circleReplacement);

// 3. REMOVE the big "Bank Logo (Optional)" block completely.
// We look for "<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '0.75rem', border: '1px dashed var(--border-color)' }}>"
let parts = code.split(`<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '0.75rem', border: '1px dashed var(--border-color)' }}>`);
if (parts.length > 1) {
    // The first part is everything before the first block.
    // We need to cut out until the matching closing div.
    let newCode = parts[0];
    
    for (let i = 1; i < parts.length; i++) {
        // Find the matching end div for this block.
        // It's a block with 3 <div> and 1 <label> inside it.
        // It ends at: </label>\n                                                        </div>\n                                                    </div>
        // Let's just find "</label>" and the following two "</div>"
        let endIdx = parts[i].indexOf('</label>');
        if (endIdx !== -1) {
            let div1 = parts[i].indexOf('</div>', endIdx);
            let div2 = parts[i].indexOf('</div>', div1 + 6);
            if (div2 !== -1) {
                newCode += parts[i].substring(div2 + 6);
            }
        } else {
             newCode += parts[i];
        }
    }
    code = newCode;
}

// 4. In handleSavePayoutSettings, we must prevent it from saving huge base64 strings if it does, 
// wait, we already upload directly to S3 and save the URL, so standard save is fine.

fs.writeFileSync('src/pages/Dashboard.jsx', code);
console.log('Done fixing');
