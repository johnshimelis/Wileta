const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const newTable = `<style>{\`.tx-row { transition: all 0.2s; border-radius: 8px; cursor: pointer; } .tx-row:hover { background: rgba(0,0,0,0.02); transform: translateX(2px); }\`}</style>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem', minWidth: '500px' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>{t('dateLabel')}</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>{t('sourceTypeLabel')}</th>
                                    <th style={{ textAlign: 'right', padding: '0.5rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>{t('amountHeaderLabel')}</th>
                                    <th style={{ textAlign: 'right', padding: '0.5rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>{t('statusHeaderLabel')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx._id} className="tx-row">
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {new Date(tx.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: tx.type === 'tip' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: tx.type === 'tip' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {tx.type === 'tip' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                                        {tx.type === 'tip' ? maskPhone(tx.tipperPhone) : t('withdrawalRequest')}
                                                    </div>
                                                    {tx.type === 'tip' && tx.message && (
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>"{tx.message}"</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 800, color: tx.type === 'tip' ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.05rem' }}>
                                            {tx.type === 'tip' ? '+' : '-'}{tx.amount.toFixed(2)} ETB
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <span style={{ 
                                                display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700,
                                                background: tx.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : tx.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: tx.status === 'success' ? '#10B981' : tx.status === 'pending' ? '#F59E0B' : '#EF4444'
                                            }}>
                                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>`;

code = code.replace(/<table>[\s\S]*?<\/table>/, newTable);

const newPayout = `<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {bankAccounts.map((account, index) => (
                                        <div key={index} style={{ padding: '1.25rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '1rem', background: 'var(--card-bg)', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: getBankColor(account.bankName), opacity: 0.7 }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    {account.logoUrl ? (
                                                        <img src={account.logoUrl} alt="Bank Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: 'white', border: '1px solid rgba(0,0,0,0.05)' }} />
                                                    ) : (
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                                            {getBankInitials(account.bankName)}
                                                        </div>
                                                    )}
                                                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Bank Account {index + 1}</span>
                                                </div>
                                                {bankAccounts.length > 1 && (
                                                    <button type="button" onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '1rem', transition: 'all 0.2s' }}>Remove</button>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <select
                                                    className="form-input"
                                                    value={account.bankName}
                                                    onChange={e => {
                                                        const newAccounts = [...bankAccounts];
                                                        newAccounts[index].bankName = e.target.value;
                                                        setBankAccounts(newAccounts);
                                                    }}
                                                    required
                                                    style={{ width: '100%', fontFamily: 'inherit', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.08)', background: 'var(--bg-color)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}
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
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Account Number</label>
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
                                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.08)', background: 'var(--bg-color)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}
                                                        />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Account Holder</label>
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
                                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.08)', background: 'var(--bg-color)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Custom Bank Logo URL (Optional)</label>
                                                    <input
                                                        type="url"
                                                        className="form-input"
                                                        placeholder="https://example.com/logo.png"
                                                        value={account.logoUrl || ''}
                                                        onChange={e => {
                                                            const newAccounts = [...bankAccounts];
                                                            newAccounts[index].logoUrl = e.target.value;
                                                            setBankAccounts(newAccounts);
                                                        }}
                                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.08)', background: 'var(--bg-color)', fontSize: '0.9rem', color: 'var(--text-main)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setBankAccounts([...bankAccounts, { bankName: '', accountNumber: '', accountHolderName: '', logoUrl: '' }])}
                                        style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--primary)', border: '2px dashed rgba(0,0,0,0.1)', padding: '1.25rem', borderRadius: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        onMouseOver={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(10, 92, 54, 0.05)'; }}
                                        onMouseOut={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.background = 'rgba(0,0,0,0.02)'; }}
                                    >
                                        <span style={{ fontSize: '1.25rem' }}>+</span> Add Another Account
                                    </button>
                                </div>`;

code = code.replace(/<div style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'1\.25rem'\s*\}\}>[\s\S]*?\+\s*Add Another Account\s*<\/button>\s*<\/div>/, newPayout);

if (!code.includes('ArrowUpRight')) {
    code = code.replace("import { CreditCard, History, Clock, ArrowRight, Wallet, CheckCircle, Smartphone, AlertTriangle, MessageCircle, Copy, Check, Menu, X, Share2, LayoutDashboard, Settings as SettingsIcon, LogOut, ChevronRight, User as UserIcon, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';", "import { CreditCard, History, Clock, ArrowRight, Wallet, CheckCircle, Smartphone, AlertTriangle, MessageCircle, Copy, Check, Menu, X, Share2, LayoutDashboard, Settings as SettingsIcon, LogOut, ChevronRight, User as UserIcon, Link as LinkIcon, Edit, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';");
    code = code.replace("import { CreditCard, History, Clock, ArrowRight, Wallet, CheckCircle, Smartphone, AlertTriangle, MessageCircle, Copy, Check, Menu, X, Share2, LayoutDashboard, Settings as SettingsIcon, LogOut, ChevronRight, User, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';", "import { CreditCard, History, Clock, ArrowRight, Wallet, CheckCircle, Smartphone, AlertTriangle, MessageCircle, Copy, Check, Menu, X, Share2, LayoutDashboard, Settings as SettingsIcon, LogOut, ChevronRight, User, Link as LinkIcon, Edit, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';");
}

fs.writeFileSync('src/pages/Dashboard.jsx', code);
