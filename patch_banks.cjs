const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldBankAccountsSectionRegex = /<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>\s*{bankAccounts.map[\s\S]*?\+ Add Another Account\s*<\/button>\s*<\/div>/;

const newBankAccountsSection = `<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {bankAccounts.map((account, index) => (
                                        <div key={index} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '1rem', background: 'var(--card-bg)', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: getBankColor(account.bankName) }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                                        {getBankInitials(account.bankName)}
                                                    </div>
                                                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Bank Account {index + 1}</span>
                                                </div>
                                                {bankAccounts.length > 1 && (
                                                    <button type="button" onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>Remove</button>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <select
                                                    className="form-input"
                                                    value={account.bankName}
                                                    onChange={e => {
                                                        const newAccounts = [...bankAccounts];
                                                        newAccounts[index].bankName = e.target.value;
                                                        setBankAccounts(newAccounts);
                                                    }}
                                                    required
                                                    style={{ width: '100%', fontFamily: 'inherit', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}
                                                >
                                                    <option value="">{t('selectBank')}</option>
                                                    <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                                                    <option value="Awash International Bank">Awash International Bank</option>
                                                    <option value="Dashen Bank">Dashen Bank</option>
                                                    <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                                                    <option value="Wegagen Bank">Wegagen Bank</option>
                                                    <option value="Nib International Bank">Nib International Bank</option>
                                                    <option value="Cooperative Bank of Oromia">Cooperative Bank of Oromia</option>
                                                </select>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder={t('accountNumber')}
                                                        value={account.accountNumber}
                                                        onChange={e => {
                                                            const newAccounts = [...bankAccounts];
                                                            newAccounts[index].accountNumber = e.target.value;
                                                            setBankAccounts(newAccounts);
                                                        }}
                                                        required
                                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}
                                                    />
                                                    <input
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
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setBankAccounts([...bankAccounts, { bankName: '', accountNumber: '', accountHolderName: '' }])}
                                        style={{ background: 'transparent', color: 'var(--primary)', border: '2px dashed var(--border-color)', padding: '1rem', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        onMouseOver={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onMouseOut={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                    >
                                        <span style={{ fontSize: '1.25rem' }}>+</span> Add Another Account
                                    </button>
                                </div>`;

code = code.replace(oldBankAccountsSectionRegex, newBankAccountsSection);
fs.writeFileSync('src/pages/Dashboard.jsx', code);
