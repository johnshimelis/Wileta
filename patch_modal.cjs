const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldModalRegex = /const WithdrawModal = \({[\s\S]*?className="btn-primary"[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?};/m;

const newModal = `const getBankColor = (name) => {
    const colors = {
        'Commercial Bank of Ethiopia (CBE)': '#5C2D91',
        'Awash International Bank': '#00539F',
        'Dashen Bank': '#F89B2B',
        'Bank of Abyssinia': '#FFC20E',
        'Wegagen Bank': '#F37021',
        'Nib International Bank': '#795548',
        'Cooperative Bank of Oromia': '#00AEEF'
    };
    return colors[name] || 'var(--primary)';
};

const getBankInitials = (name) => {
    if (!name) return 'BK';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const WithdrawModal = ({
    show, onClose, withdrawType, setWithdrawType, balance,
    customAmount, setCustomAmount, onConfirm, loading, user
}) => {
    const { t } = useLanguage();
    const [selectedBankIndex, setSelectedBankIndex] = useState(0);

    if (!show) return null;

    const banks = user?.bankAccounts?.length > 0 ? user.bankAccounts : (user?.bankDetails?.bankName ? [user.bankDetails] : []);
    const isBank = user?.payoutMethod === 'bank';

    return (
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(5px)', animation: 'fade-in 0.3s ease-out' }}
            onClick={onClose}
        >
            <div className="drawer" style={{ 
                width: '100%', 
                maxWidth: '480px', 
                height: '100%', 
                background: 'var(--bg-color)', 
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', 
                display: 'flex', 
                flexDirection: 'column', 
                animation: 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
            }} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{t('withdrawFunds')}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>Available: {balance.toFixed(2)} ETB</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-color)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Destination</h3>
                    
                    {isBank ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                            {banks.length > 0 ? banks.map((bank, index) => (
                                <div key={index} onClick={() => setSelectedBankIndex(index)} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                    border: \`2px solid \${selectedBankIndex === index ? 'var(--primary)' : 'var(--border-color)'}\`,
                                    background: 'var(--card-bg)',
                                    borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getBankColor(bank.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                                        {getBankInitials(bank.bankName)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bank.bankName}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bank.accountNumber} • {bank.accountHolderName}</div>
                                    </div>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: \`2px solid \${selectedBankIndex === index ? 'var(--primary)' : 'var(--border-color)'}\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {selectedBankIndex === index && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>No bank accounts found. Please add one in settings.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: '1.25rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Telebirr Wallet</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.telebirr_number || user?.phone}</div>
                            </div>
                        </div>
                    )}

                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Amount</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <div
                            onClick={() => setWithdrawType('all')}
                            style={{ padding: '1.25rem', borderRadius: '1rem', border: \`2px solid \${withdrawType === 'all' ? 'var(--primary)' : 'var(--border-color)'}\`, background: withdrawType === 'all' ? 'var(--primary-light)' : 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{t('withdrawAll')}</span>
                                {withdrawType === 'all' && <CheckCircle size={18} color="var(--primary)" />}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transfer your full {balance.toFixed(2)} ETB</p>
                        </div>

                        <div
                            onClick={() => setWithdrawType('custom')}
                            style={{ padding: '1.25rem', borderRadius: '1rem', border: \`2px solid \${withdrawType === 'custom' ? 'var(--primary)' : 'var(--border-color)'}\`, background: withdrawType === 'custom' ? 'var(--primary-light)' : 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{t('customAmountPlaceholder')}</span>
                                {withdrawType === 'custom' && <CheckCircle size={18} color="var(--primary)" />}
                            </div>
                            {withdrawType === 'custom' && (
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem' }}>ETB</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="0.00"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        autoFocus
                                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', fontWeight: 800, width: '100%', color: 'var(--text-main)' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '2rem', borderTop: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
                    <button
                        onClick={() => onConfirm(isBank ? banks[selectedBankIndex] : null)}
                        disabled={loading || (isBank && banks.length === 0) || (withdrawType === 'custom' && (!customAmount || Number(customAmount) <= 0))}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1.15rem', fontSize: '1.1rem', borderRadius: '1rem' }}
                    >
                        {loading ? <span className="spinner"></span> : t('confirm')}
                    </button>
                </div>
            </div>
            <style>{\`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            \`}</style>
        </div>
    );
};`;

code = code.replace(oldModalRegex, newModal);
fs.writeFileSync('src/pages/Dashboard.jsx', code);
