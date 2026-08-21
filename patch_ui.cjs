const fs = require('fs');
const content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldUI = `                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <select
                                            className="form-input"
                                            value={bankName}
                                            onChange={e => setBankName(e.target.value)}
                                            required
                                            style={{ width: '100%', fontFamily: 'inherit', padding: '0.6rem' }}
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
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={t('accountNumber')}
                                            value={accountNumber}
                                            onChange={e => setAccountNumber(e.target.value)}
                                            required
                                            style={{ padding: '0.6rem' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={t('accountHolder')}
                                            value={accountHolderName}
                                            onChange={e => setAccountHolderName(e.target.value)}
                                            required
                                            style={{ padding: '0.6rem' }}
                                        />
                                    </div>
                                </div>
                            )`;

const newUI = `                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {bankAccounts.map((account, index) => (
                                        <div key={index} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', background: 'var(--card-bg)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Bank Account {index + 1}</span>
                                                {bankAccounts.length > 1 && (
                                                    <button type="button" onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Remove</button>
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
                                                    style={{ width: '100%', fontFamily: 'inherit', padding: '0.6rem' }}
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
                                                    style={{ padding: '0.6rem' }}
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
                                                    style={{ padding: '0.6rem' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setBankAccounts([...bankAccounts, { bankName: '', accountNumber: '', accountHolderName: '' }])}
                                        style={{ background: 'rgba(10, 92, 54, 0.1)', color: 'var(--primary)', border: '1px dashed var(--primary)', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        + Add Another Account
                                    </button>
                                </div>
                            )`;

fs.writeFileSync('src/pages/Dashboard.jsx', content.replace(oldUI, newUI));
