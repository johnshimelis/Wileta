const fs = require('fs');

// Fix Dashboard.jsx build error
let dashCode = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
dashCode = dashCode.replace("import api from '../utils/api';\r\n", "");
dashCode = dashCode.replace("import api from '../utils/api';\n", "");

// Now add the logo upload in Dashboard.jsx
const oldStr = `                                                    <input
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
                                        </div>`;

const newStr = `                                                    <input
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
                                                </div>
                                            </div>
                                        </div>`;

dashCode = dashCode.split(oldStr).join(newStr);
fs.writeFileSync('src/pages/Dashboard.jsx', dashCode);

console.log("Fixed Dashboard api and added logo upload.");
