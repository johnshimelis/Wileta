import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Copy, CheckCircle, Wallet, History, ArrowUpRight, ArrowDownRight,
    TrendingUp, AlertTriangle, ShieldCheck, XCircle, User,
    ExternalLink, Menu, X, Smartphone, Upload, Edit2, AlertCircle, Sparkles,
    Search, Filter, ArrowRight, Share2, DollarSign, Building, RefreshCw, QrCode,
    Zap, Check
} from 'lucide-react';
import TopAlert from '../components/TopAlert';
import NotificationDrawer from '../components/NotificationDrawer';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

// Official Verified Blue Tick SVG Emblem
const VerifiedBlueTick = ({ size = 24, title = "Verified Creator" }) => (
    <span 
        title={title}
        style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            verticalAlign: 'middle',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M10.5 2.5C11.3 1.8 12.7 1.8 13.5 2.5L14.7 3.6C15.2 4.1 15.9 4.3 16.6 4.3L18.2 4.2C19.3 4.1 20.3 5.0 20.2 6.1L20.1 7.7C20.1 8.4 20.4 9.1 20.8 9.6L22.0 10.8C22.7 11.6 22.7 12.9 22.0 13.7L20.8 14.9C20.4 15.4 20.1 16.1 20.1 16.8L20.2 18.4C20.3 19.5 19.3 20.4 18.2 20.3L16.6 20.2C15.9 20.2 15.2 20.4 14.7 20.9L13.5 22.0C12.7 22.7 11.3 22.7 10.5 22.0L9.3 20.9C8.8 20.4 8.1 20.2 7.4 20.2L5.8 20.3C4.7 20.4 3.7 19.5 3.8 18.4L3.9 16.8C3.9 16.1 3.6 15.4 3.2 14.9L2.0 13.7C1.3 12.9 1.3 11.6 2.0 10.8L3.2 9.6C3.6 9.1 3.9 8.4 3.9 7.7L3.8 6.1C3.7 5.0 4.7 4.1 5.8 4.2L7.4 4.3C8.1 4.3 8.8 4.1 9.3 3.6L10.5 2.5Z" 
                fill="#1D9BF0" 
            />
            <path 
                d="M8.5 12.5L10.8 14.8L15.8 9.5" 
                stroke="#FFFFFF" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    </span>
);

const getBankLogo = (name) => {
    if (!name) return null;
    const n = name.toLowerCase();
    if (n.includes('telebirr')) return '/banks/telebirr.jpg';
    if (n.includes('commercial') || n.includes('cbe')) return '/banks/cbe.jpg';
    if (n.includes('abyssinia') || n.includes('boa')) return '/banks/abyssinia.png';
    if (n.includes('awash')) return '/banks/awash.png';
    if (n.includes('dashen')) return '/banks/dashen.png';
    if (n.includes('coop') || n.includes('oromia')) return '/banks/coop.png';
    return null;
};

const getBankColor = (name) => {
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
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(9, 9, 11, 0.7)',
                zIndex: 9000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    maxWidth: '460px',
                    width: '100%',
                    padding: '2rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    boxSizing: 'border-box'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wallet size={22} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{t('withdrawFunds')}</h3>
                            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Available: {balance.toFixed(2)} ETB</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Destination */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Payout Destination
                    </label>
                    {isBank ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {banks.length > 0 ? banks.map((bank, index) => {
                                const logo = bank.logoUrl || getBankLogo(bank.bankName);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedBankIndex(index)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.85rem 1rem',
                                            border: '1.5px solid ' + (selectedBankIndex === index ? 'var(--primary)' : 'var(--border-color)'),
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            background: selectedBankIndex === index ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                                            {logo ? (
                                                <img src={logo} alt={bank.bankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', borderRadius: '6px', background: getBankColor(bank.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                                                    {getBankInitials(bank.bankName)}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bank.bankName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bank.accountNumber} • {bank.accountHolderName}</div>
                                        </div>
                                        {selectedBankIndex === index && <CheckCircle size={18} color="var(--primary)" />}
                                    </div>
                                );
                            }) : (
                                <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>No bank accounts configured.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: '0.85rem 1rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                                <img src="/banks/telebirr.jpg" alt="Telebirr" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>Telebirr Wallet</div>
                                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{user?.telebirr_number || user?.phone}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Amount Option */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Withdrawal Amount
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setWithdrawType('all')}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1.5px solid ' + (withdrawType === 'all' ? 'var(--primary)' : 'var(--border-color)'),
                                background: withdrawType === 'all' ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                color: withdrawType === 'all' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            Full Balance ({balance.toFixed(2)} ETB)
                        </button>
                        <button
                            type="button"
                            onClick={() => setWithdrawType('custom')}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1.5px solid ' + (withdrawType === 'custom' ? 'var(--primary)' : 'var(--border-color)'),
                                background: withdrawType === 'custom' ? 'var(--primary-light)' : 'var(--card-bg-subtle)',
                                color: withdrawType === 'custom' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            Custom Amount
                        </button>
                    </div>

                    {withdrawType === 'custom' && (
                        <div className="input-group">
                            <span style={{ position: 'absolute', left: '1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>ETB</span>
                            <input
                                type="number"
                                min="1"
                                placeholder="0.00"
                                className="form-input"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                style={{ paddingLeft: '3.5rem' }}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '0.75rem' }}>
                    <Button variant="secondary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        loading={loading}
                        disabled={balance <= 0 || (isBank && banks.length === 0) || (withdrawType === 'custom' && (!customAmount || Number(customAmount) <= 0))}
                        onClick={() => onConfirm(isBank ? banks[selectedBankIndex] : null)}
                    >
                        Confirm Payout
                    </Button>
                </div>
            </div>
        </div>
    );
};

const WithdrawSuccessModal = ({ data, onClose, user }) => {
    const { t } = useLanguage();
    if (!data) return null;
    return (
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 9, 11, 0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '1rem' }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    maxWidth: '440px',
                    width: '100%',
                    padding: '2.25rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ width: '60px', height: '60px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <CheckCircle size={32} />
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>{t('transferRequested')}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{t('pendingAdminReview')}</p>

                <div style={{ background: 'var(--card-bg-subtle)', borderRadius: '12px', padding: '1.15rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Amount Requested</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>{data.amount.toFixed(2)} ETB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Payout Method</span>
                        <span style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-main)' }}>{user?.payoutMethod || 'telebirr'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Remaining Balance</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{data.newBalance.toFixed(2)} ETB</span>
                    </div>
                </div>

                <Button variant="primary" size="md" className="btn-full" onClick={onClose}>
                    {t('greatThanks')}
                </Button>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { user, api, setUser } = useAuth();
    const { triggerNotification } = useNotification();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [metrics, setMetrics] = useState({ total_earned: 0, pending_balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [copied, setCopied] = useState(false);
    const [obsCopied, setObsCopied] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawType, setWithdrawType] = useState('all');
    const [customAmount, setCustomAmount] = useState('');
    const [withdrawSuccessData, setWithdrawSuccessData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Transaction filter tab: 'all' | 'tips' | 'withdrawals'
    const [txFilter, setTxFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Payout settings
    const [payoutMethod, setPayoutMethod] = useState(user?.payoutMethod || 'telebirr');
    const initialBankAccounts = user?.bankAccounts?.length > 0
        ? user.bankAccounts
        : (user?.bankDetails?.bankName ? [user.bankDetails] : [{ bankName: '', accountNumber: '', accountHolderName: '', logoUrl: '' }]);
    const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
    const [savingPayout, setSavingPayout] = useState(false);

    useEffect(() => {
        if (user) {
            setPayoutMethod(user.payoutMethod || 'telebirr');
            if (user.bankAccounts?.length > 0) {
                setBankAccounts(user.bankAccounts);
            } else if (user.bankDetails?.bankName) {
                setBankAccounts([user.bankDetails]);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [metricsRes, txRes, leaderboardRes] = await Promise.all([
                api.get('/dashboard/metrics'),
                api.get('/dashboard/transactions'),
                api.get('/dashboard/leaderboard').catch(() => ({ data: [] }))
            ]);
            setMetrics(metricsRes.data);
            setTransactions(txRes.data);
            setLeaderboard(leaderboardRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
        setIsLoading(false);
    };

    const handleWithdraw = async (bankAccount) => {
        setIsWithdrawing(true);
        try {
            const withdrawAmount = withdrawType === 'all' ? metrics.pending_balance : Number(customAmount);
            const payload = {
                amount: withdrawAmount,
                type: withdrawType
            };
            if (bankAccount) {
                payload.bankAccount = bankAccount;
            }
            const res = await api.post('/dashboard/withdraw', payload);
            setWithdrawSuccessData({
                amount: withdrawAmount,
                newBalance: res.data.newBalance !== undefined ? res.data.newBalance : metrics.pending_balance - withdrawAmount
            });
            setShowWithdrawModal(false);
            setCustomAmount('');
            fetchDashboardData();
        } catch (error) {
            setAlert({ message: error.response?.data?.error || "Withdrawal failed", type: "error" });
        }
        setIsWithdrawing(false);
    };

    const handleLogoUpload = async (file, accountIndex) => {
        try {
            const formData = new FormData();
            formData.append('logo', file);
            const res = await api.post('/auth/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.logoUrl) {
                const newAccounts = [...bankAccounts];
                newAccounts[accountIndex].logoUrl = res.data.logoUrl;
                setBankAccounts(newAccounts);

                const saveRes = await api.post('/auth/update-profile', {
                    payoutMethod,
                    bankAccounts: newAccounts
                });
                setUser(saveRes.data);
                triggerNotification({
                    title: 'Logo Updated',
                    message: 'Bank logo saved successfully.',
                    type: 'success'
                });
            }
        } catch (error) {
            setAlert({ message: "Failed to upload bank logo", type: "error" });
        }
    };

    const handleSavePayoutSettings = async (e) => {
        e.preventDefault();
        setSavingPayout(true);
        try {
            const res = await api.post('/auth/update-profile', {
                payoutMethod,
                bankAccounts: payoutMethod === 'bank' ? bankAccounts : undefined
            });
            setUser(res.data);
            setAlert({ message: t('changesSavedShort'), type: 'success' });
        } catch (error) {
            setAlert({ message: error.response?.data?.error || "Failed to save payout settings", type: "error" });
        }
        setSavingPayout(false);
    };

    const tipUrl = window.location.origin + '/' + (user?.username || '');
    const obsUrl = window.location.origin + '/overlay/' + (user?._id || '');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tipUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyObsUrl = () => {
        navigator.clipboard.writeText(obsUrl);
        setObsCopied(true);
        setTimeout(() => setObsCopied(false), 2000);
    };

    const maskPhone = (phone) => {
        if (!phone) return 'Supporter';
        if (phone.length >= 10) return phone.slice(0, 4) + '****' + phone.slice(-2);
        return phone;
    };

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (txFilter === 'tips' && tx.type !== 'tip') return false;
            if (txFilter === 'withdrawals' && tx.type === 'tip') return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const phone = tx.tipperPhone ? tx.tipperPhone.toLowerCase() : '';
                const msg = tx.message ? tx.message.toLowerCase() : '';
                return phone.includes(q) || msg.includes(q);
            }
            return true;
        });
    }, [transactions, txFilter, searchQuery]);

    const isVerified = user?.kycStatus === 'approved' || user?.isVerified;

    // Resolve Active Payout Rail Logo
    const activeBankName = user?.payoutMethod === 'bank' ? bankAccounts[0]?.bankName : 'Telebirr';
    const activeRailLogo = user?.payoutMethod === 'bank'
        ? (bankAccounts[0]?.logoUrl || getBankLogo(activeBankName))
        : '/banks/telebirr.jpg';

    return (
        <div className="app-layout">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="mobile-header">
                <Logo size="small" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <NotificationDrawer />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="main-content">
                {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

                
                {/* Dashboard Executive Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 1.75rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span>{t('welcome')}, {user?.name?.split(' ')[0] || 'Creator'}</span>
                                <span style={{ fontSize: '1.35rem' }}>👋</span>
                                {isVerified && <VerifiedBlueTick size={22} title="GurshaPay Verified Creator" />}
                            </h1>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: 0 }}>
                            Real-time overview of your monetization and incoming Telebirr support.
                        </p>
                    </div>

                    <div className="desktop-only" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <NotificationDrawer />
                        <a href={tipUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <Button variant="outline" size="sm" icon={ExternalLink} iconPosition="right">
                                {t('viewPublicPage')}
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Handshake-Style Action Checklist */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '1.25rem', marginTop: '0.5rem', marginBottom: '2rem',
                    boxShadow: 'var(--shadow-xs)',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                Creator Monetization Checklist
                            </h3>
                            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                                Complete these steps to maximize your tip conversion
                            </span>
                        </div>
                        <span style={{ fontSize: '0.725rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                            {isVerified ? '3 of 3 Completed' : '2 of 3 Completed'}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem', width: '100%' }}>
                        {/* Item 1: Payout Method */}
                        <div 
                            onClick={() => {
                                const el = document.getElementById('payout-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} color="var(--primary)" />
                                <div>
                                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>Set up payout rail</div>
                                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Telebirr / Bank connected</div>
                                </div>
                            </div>
                            <Badge variant="success" size="sm">Active</Badge>
                        </div>

                        {/* Item 2: KYC Identity */}
                        <div 
                            onClick={() => { if (!isVerified) navigate('/kyc'); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {isVerified ? <CheckCircle size={16} color="var(--primary)" /> : <ShieldCheck size={16} color="var(--warning)" />}
                                <div>
                                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>Verify National ID</div>
                                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Fayda ID / Passport</div>
                                </div>
                            </div>
                            <Badge variant={isVerified ? 'success' : 'warning'} size="sm">
                                {isVerified ? 'Verified' : 'Required'}
                            </Badge>
                        </div>

                        {/* Item 3: Public Page */}
                        <div 
                            onClick={copyToClipboard}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.85rem', background: 'var(--card-bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} color="var(--primary)" />
                                <div>
                                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>Share your link</div>
                                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>gurshapay.com/@{user?.username}</div>
                                </div>
                            </div>
                            <Badge variant="primary" size="sm">Ready</Badge>
                        </div>
                    </div>
                </div>

                {/* KYC Warning Banner if needed */}
                {!isVerified && (
                    <div style={{
                        background: 'rgba(217, 119, 6, 0.08)',
                        border: '1px solid var(--warning)',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '1.75rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <AlertTriangle size={20} color="var(--warning)" style={{ flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    {user?.kycStatus === 'pending' ? 'Identity verification in review' : 'National ID Verification Required'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {user?.kycStatus === 'pending' ? 'Our compliance team is verifying your Fayda ID / Passport. Direct payouts unlock upon approval.' : 'Verify your national ID to unlock instant Telebirr & Multi-Bank withdrawals.'}
                                </div>
                            </div>
                        </div>
                        {user?.kycStatus !== 'pending' && (
                            <Button variant="primary" size="sm" onClick={() => navigate('/kyc')}>
                                Verify Now
                            </Button>
                        )}
                    </div>
                )}

                {/* 3 EQUAL-WIDTH TOP METRIC CARDS */}
                <div className="dashboard-metrics-grid" style={{ marginBottom: '1.75rem' }}>
                    {/* Card 1: CURRENT BALANCE */}
                    <div
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        {t('currentBalance')}
                                    </span>
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                                </div>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Wallet size={16} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    {isLoading ? '...' : metrics.pending_balance.toFixed(2)}
                                </span>
                                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>ETB</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={ArrowUpRight}
                                iconPosition="right"
                                disabled={metrics.pending_balance <= 0 || !isVerified}
                                onClick={() => setShowWithdrawModal(true)}
                            >
                                {t('withdrawFunds')}
                            </Button>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {isVerified ? '⚡ Instant payout' : '🔒 KYC required'}
                            </span>
                        </div>
                    </div>

                    {/* Card 2: TOTAL TIPS */}
                    <div
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {t('totalTips')}
                                </span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(4, 120, 87, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TrendingUp size={16} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    {isLoading ? '...' : metrics.total_earned.toFixed(2)}
                                </span>
                                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>ETB</span>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Sparkles size={13} color="#D97706" />
                            <span>Lifetime total received from audience</span>
                        </div>
                    </div>

                    {/* Card 3: PAYOUT RAIL (WITH REAL BANK LOGO) */}
                    <div
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '14px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: 'var(--shadow-xs)',
                            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Payout Rail
                                </span>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                                    {activeRailLogo ? (
                                        <img src={activeRailLogo} alt={activeBankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <Building size={16} color="var(--primary)" />
                                    )}
                                </div>
                            </div>

                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.payoutMethod === 'bank' ? (bankAccounts[0]?.bankName || 'Bank Transfer') : 'Telebirr Wallet'}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.775rem' }}>
                            <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.payoutMethod === 'bank' ? (bankAccounts[0]?.accountNumber || 'Configured') : (user?.telebirr_number || user?.phone || 'Configured')}
                            </span>
                            <Badge variant="primary" size="sm">Active Rail</Badge>
                        </div>
                    </div>
                </div>

                {/* QUICK INTEGRATIONS & SHARING TOOLSTRIP */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                    {/* Share Tipping Handle */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                {t('tippingLinkTitle')}
                            </span>
                            <Badge variant="primary" size="sm">Public Link</Badge>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                            {t('tippingLinkDesc')}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg-subtle)', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', paddingLeft: '0.25rem' }}>
                                {tipUrl}
                            </span>
                            <Button variant="primary" size="sm" icon={copied ? CheckCircle : Copy} onClick={copyToClipboard}>
                                {copied ? t('copied') : t('copy')}
                            </Button>
                        </div>
                    </div>

                    {/* OBS Livestream Overlay */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Sparkles size={16} color="#D97706" /> {t('obsOverlayTitle')}
                            </span>
                            <Badge variant="warning" size="sm">OBS 1080p</Badge>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                            Browser Source URL for live stream alerts & sound effects.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg-subtle)', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
                                {obsUrl}
                            </span>
                            <Button variant="secondary" size="sm" icon={obsCopied ? CheckCircle : Copy} onClick={copyObsUrl}>
                                {obsCopied ? t('copied') : 'Copy URL'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2-COLUMN SECTION: RECENT TRANSACTIONS & TOP SUPPORTERS */}
                <div className="dashboard-two-col-grid" style={{ marginBottom: '2rem' }}>
                    {/* Recent Transactions List with Tab Filter */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xs)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                    {t('recentTransactions')}
                                </h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {filteredTransactions.length} activity records
                                </span>
                            </div>

                            {/* Filter Tabs */}
                            <div style={{ display: 'flex', background: 'var(--card-bg-subtle)', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <button
                                    onClick={() => setTxFilter('all')}
                                    style={{
                                        border: 'none',
                                        background: txFilter === 'all' ? 'var(--card-bg)' : 'transparent',
                                        color: txFilter === 'all' ? 'var(--primary)' : 'var(--text-muted)',
                                        padding: '0.3rem 0.7rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: txFilter === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                        transition: 'all 0.12s ease'
                                    }}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setTxFilter('tips')}
                                    style={{
                                        border: 'none',
                                        background: txFilter === 'tips' ? 'var(--card-bg)' : 'transparent',
                                        color: txFilter === 'tips' ? 'var(--primary)' : 'var(--text-muted)',
                                        padding: '0.3rem 0.7rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: txFilter === 'tips' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                        transition: 'all 0.12s ease'
                                    }}
                                >
                                    Tips
                                </button>
                                <button
                                    onClick={() => setTxFilter('withdrawals')}
                                    style={{
                                        border: 'none',
                                        background: txFilter === 'withdrawals' ? 'var(--card-bg)' : 'transparent',
                                        color: txFilter === 'withdrawals' ? 'var(--primary)' : 'var(--text-muted)',
                                        padding: '0.3rem 0.7rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: txFilter === 'withdrawals' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                        transition: 'all 0.12s ease'
                                    }}
                                >
                                    Payouts
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.75rem' }} />
                                <div>Loading transaction history...</div>
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <History size={32} style={{ opacity: 0.35, margin: '0 auto 0.75rem' }} />
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('noTransactionsYet')}</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Your incoming tips and withdrawals will appear here automatically.</div>
                            </div>
                        ) : (
                            <div className="table-responsive-wrapper" style={{ border: 'none' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Supporter / Method</th>
                                            <th style={{ textAlign: 'right' }}>Amount</th>
                                            <th style={{ textAlign: 'right' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.slice(0, 10).map((tx) => (
                                            <tr key={tx._id} style={{ transition: 'background 0.12s ease' }}>
                                                <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                        <div style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            borderRadius: '50%',
                                                            background: tx.type === 'tip' ? 'var(--success-light)' : 'var(--danger-light)',
                                                            color: tx.type === 'tip' ? 'var(--success)' : 'var(--danger)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        }}>
                                                            {tx.type === 'tip' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                                                {tx.type === 'tip' ? maskPhone(tx.tipperPhone) : 'Withdrawal Request'}
                                                            </div>
                                                            {tx.message && (
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    "{tx.message}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '0.9rem', color: tx.type === 'tip' ? 'var(--success)' : 'var(--text-main)', whiteSpace: 'nowrap' }}>
                                                    {tx.type === 'tip' ? '+' : '-'}{tx.amount.toFixed(2)} ETB
                                                </td>
                                                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                    <Badge variant={tx.status === 'success' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'} size="sm">
                                                        {tx.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Top Fans Leaderboard */}
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xs)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                    {t('leaderboardTitle')}
                                </h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top supporters by total ETB</span>
                            </div>
                            <Badge variant="primary" size="sm">Top 5</Badge>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <RefreshCw size={24} className="spin" style={{ margin: '0 auto 0.75rem' }} />
                                <div>Loading leaderboard...</div>
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <User size={32} style={{ opacity: 0.35, margin: '0 auto 0.75rem' }} />
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('noTipsYet')}</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{t('noTipsSubtitle')}</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {leaderboard.map((fan, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 0.95rem',
                                            background: 'var(--card-bg-subtle)',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            transition: 'all 0.15s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                    >
                                        <div
                                            style={{
                                                width: '26px',
                                                height: '26px',
                                                borderRadius: '50%',
                                                background: idx === 0 ? '#FBBC05' : idx === 1 ? '#94A3B8' : idx === 2 ? '#D97706' : 'var(--border-color)',
                                                color: '#FFFFFF',
                                                fontWeight: 900,
                                                fontSize: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {maskPhone(fan._id)}
                                            </div>
                                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                                                {fan.count || 1} support payments
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 900, fontSize: '0.925rem', color: 'var(--primary)' }}>
                                            {fan.totalTipped.toFixed(2)} ETB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* PAYOUT ROUTING & MULTI-BANK MANAGER */}
                <div id="payout-section" style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '1.75rem',
                    marginBottom: '2rem',
                    boxShadow: 'var(--shadow-xs)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                {t('payoutDetailsTitle')}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                                {t('payoutDetailsDesc')}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSavePayoutSettings}>
                        {/* Payout Method Toggle */}
                        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--card-bg-subtle)', padding: '0.25rem', borderRadius: '8px', marginBottom: '1.5rem', width: 'fit-content', border: '1px solid var(--border-color)' }}>
                            <button
                                type="button"
                                onClick={() => setPayoutMethod('telebirr')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: payoutMethod === 'telebirr' ? 'var(--card-bg)' : 'transparent',
                                    color: payoutMethod === 'telebirr' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: payoutMethod === 'telebirr' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                Telebirr Wallet
                            </button>
                            <button
                                type="button"
                                onClick={() => setPayoutMethod('bank')}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: payoutMethod === 'bank' ? 'var(--card-bg)' : 'transparent',
                                    color: payoutMethod === 'bank' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: payoutMethod === 'bank' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                Bank Accounts
                            </button>
                        </div>

                        {payoutMethod === 'telebirr' ? (
                            <div style={{ background: 'var(--card-bg-subtle)', padding: '1.15rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px', flexShrink: 0 }}>
                                    <img src="/banks/telebirr.jpg" alt="Telebirr" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                    {t('telebirrWithdrawNotice')}{' '}
                                    <strong style={{ color: 'var(--primary)' }}>{user?.telebirr_number || user?.phone}</strong>
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                {bankAccounts.map((account, index) => {
                                    const logo = account.logoUrl || getBankLogo(account.bankName);
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '1.25rem',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--card-bg-subtle)',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <label
                                                        title="Upload / Change logo"
                                                        style={{ position: 'relative', width: '38px', height: '38px', cursor: 'pointer', flexShrink: 0 }}
                                                    >
                                                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                                                            {logo ? (
                                                                <img src={logo} alt={account.bankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            ) : (
                                                                <div style={{ width: '100%', height: '100%', borderRadius: '6px', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                                    {getBankInitials(account.bankName)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#10B981', color: 'white', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--card-bg)' }}>
                                                            <Edit2 size={8} />
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    handleLogoUpload(e.target.files[0], index);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                    <div>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Bank Account {index + 1}</span>
                                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                                                            <Upload size={10} style={{ display: 'inline', marginRight: '3px' }} />
                                                            {account.logoUrl ? 'Change Custom Logo' : 'Upload Custom Logo'}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        handleLogoUpload(e.target.files[0], index);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                {bankAccounts.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))}
                                                        style={{ background: 'var(--danger-light)', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '6px' }}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                                <select
                                                    className="form-select"
                                                    value={account.bankName}
                                                    onChange={e => {
                                                        const newAccounts = [...bankAccounts];
                                                        newAccounts[index].bankName = e.target.value;
                                                        setBankAccounts(newAccounts);
                                                    }}
                                                    required
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
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                                <button
                                    type="button"
                                    onClick={() => setBankAccounts([...bankAccounts, { bankName: '', accountNumber: '', accountHolderName: '', logoUrl: '' }])}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--primary)',
                                        border: '1px dashed var(--border-color)',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    + Add Another Bank Account
                                </button>
                            </div>
                        )}

                        <Button type="submit" variant="primary" size="md" loading={savingPayout}>
                            {t('savePayoutDetails')}
                        </Button>
                    </form>
                </div>

                {/* Withdraw Modal */}
                <WithdrawModal
                    show={showWithdrawModal}
                    onClose={() => setShowWithdrawModal(false)}
                    withdrawType={withdrawType}
                    setWithdrawType={setWithdrawType}
                    balance={metrics.pending_balance}
                    customAmount={customAmount}
                    setCustomAmount={setCustomAmount}
                    onConfirm={handleWithdraw}
                    loading={isWithdrawing}
                    user={user}
                />

                {/* Withdraw Success Modal */}
                <WithdrawSuccessModal
                    data={withdrawSuccessData}
                    onClose={() => setWithdrawSuccessData(null)}
                    user={user}
                />
            </main>
        </div>
    );
}
