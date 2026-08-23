const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const bankLogoUploadPatch = `<div>
                                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Custom Bank Logo</label>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        {account.logoUrl && (
                                                            <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', background: '#fff' }}>
                                                                <img src={account.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                                <button type="button" onClick={() => {
                                                                    const newAccounts = [...bankAccounts];
                                                                    newAccounts[index].logoUrl = '';
                                                                    setBankAccounts(newAccounts);
                                                                }} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}>&times;</button>
                                                            </div>
                                                        )}
                                                        <label style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', border: '1px dashed rgba(0,0,0,0.2)', background: 'var(--bg-color)', transition: 'all 0.2s', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                            <span>{account.logoUrl ? 'Change Logo' : 'Upload Logo Image'}</span>
                                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        const newAccounts = [...bankAccounts];
                                                                        newAccounts[index].logoUrl = reader.result;
                                                                        setBankAccounts(newAccounts);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }} />
                                                        </label>
                                                    </div>
                                                </div>`;

code = code.replace(/<div>\s*<label[^>]*>Custom Bank Logo URL \(Optional\)<\/label>[\s\S]*?<\/div>/, bankLogoUploadPatch);

fs.writeFileSync('src/pages/Dashboard.jsx', code);
console.log("Regex replaced.");
