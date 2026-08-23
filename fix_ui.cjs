const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldInput = `<input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder={t('accountHolder')}
                                                        value={account.accountHolderName}
                                                        onChange={e => {
                                                            const newAccounts = [...bankAccounts];
                                                            newAccounts[index].accountHolderName = e.target.value;
                                                            setBankAccounts(newAccounts);
                                                        }}
                                                        required
                                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}
                                                    />
                                                </div>`;

const newInput = `<input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder={t('accountHolder')}
                                                        value={account.accountHolderName}
                                                        onChange={e => {
                                                            const newAccounts = [...bankAccounts];
                                                            newAccounts[index].accountHolderName = e.target.value;
                                                            setBankAccounts(newAccounts);
                                                        }}
                                                        required
                                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}
                                                    />
                                                </div>
                                                <div style={{ marginTop: '0.75rem' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.05)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px dashed var(--primary)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                                                        <Upload size={16} />
                                                        {account.logoUrl ? 'Change Bank Logo' : 'Upload Bank Logo (Optional)'}
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
                                                    {account.logoUrl && (
                                                        <div style={{ marginTop: '0.5rem', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                                                            <img src={account.logoUrl} alt="Bank Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
                                                        </div>
                                                    )}
                                                </div>`;

if (code.includes(oldInput)) {
    code = code.replace(oldInput, newInput);
    fs.writeFileSync('src/pages/Dashboard.jsx', code);
    console.log("Added Logo Uploader to Dashboard Bank Accounts");
} else {
    console.log("Could not find the target string in Dashboard.jsx");
}

let sidebarCode = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');
if (!sidebarCode.includes("boxShadow: 'inset 4px 0 0 var(--primary)'")) {
    sidebarCode = sidebarCode.replace(
        `className=\`nav-item \${active ? 'active' : ''}\``,
        `className=\`nav-item \${active ? 'active' : ''}\`
                style={active ? { background: 'var(--primary-light)', color: 'var(--primary)', boxShadow: 'inset 4px 0 0 var(--primary)' } : {}}`
    );
    fs.writeFileSync('src/components/Sidebar.jsx', sidebarCode);
    console.log("Made Sidebar nav-items more interactive");
}

let indexCss = fs.readFileSync('src/index.css', 'utf8');
if (!indexCss.includes("transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;")) {
    indexCss = indexCss.replace(
        "transition: transform 0.2s ease, box-shadow 0.2s ease;",
        "transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;"
    );
    indexCss += `
.premium-card:hover {
  border-color: var(--primary);
}
.sidebar {
  border-right: 1px solid rgba(0,0,0,0.05);
  box-shadow: 4px 0 24px rgba(0,0,0,0.02);
}
`;
    fs.writeFileSync('src/index.css', indexCss);
    console.log("Enhanced CSS Interactivity");
}
