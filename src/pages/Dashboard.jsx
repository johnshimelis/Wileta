import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    Copy, CheckCircle, Wallet, History, ArrowUpRight, ArrowDownRight,
    TrendingUp, AlertTriangle, ShieldCheck, XCircle, User,
    ExternalLink, Menu, X, Smartphone, Upload, Edit2, AlertCircle, Sparkles
} from 'lucide-react';
import TopAlert from '../components/TopAlert';
import NotificationDrawer from '../components/NotificationDrawer';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

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
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
            onClick={onClose}
        >
            <div className="auth-card" style={{ maxWidth: '440px', width: '90%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{t('withdrawFunds')}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available: {balance.toFixed(2)} ETB</span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Destination */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem' }}>Payout Destination</label>
                    {isBank ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {banks.length > 0 ? banks.map((bank, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedBankIndex(index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        border: '2px solid ' + (selectedBankIndex === index ? 'var(--primary)' : 'var(--border-color)'),
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        background: selectedBankIndex === index ? 'var(--primary-light)' : 'var(--card-bg)'
                                    }}
                                >
                                    {bank.logoUrl ? (
                                        <img src={bank.logoUrl} alt={bank.bankName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getBankColor(bank.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                                            {getBankInitials(bank.bankName)}
                                        </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bank.bankName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bank.accountNumber} • {bank.accountHolderName}</div>
                                    </div>
                                    {selectedBankIndex === index && <CheckCircle size={16} color="var(--primary)" />}
                                </div>
                            )) : (
                                <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>No bank accounts found.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: '0.75rem', background: 'var(--card-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={16} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Telebirr Wallet</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.telebirr_number || user?.phone}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Amount Option */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem' }}>Withdrawal Amount</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={() => setWithdrawType('all')}
                            style={{
                                padding: '0.65rem',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid ' + (withdrawType === 'all' ? 'var(--primary)' : 'var(--border-color)'),
                                background: withdrawType === 'all' ? 'var(--primary-light)' : 'var(--card-bg)',
                                color: withdrawType === 'all' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            Full Balance ({balance.toFixed(2)} ETB)
                        </button>
                        <button
                            type="button"
                            onClick={() => setWithdrawType('custom')}
                            style={{
                                padding: '0.65rem',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid ' + (withdrawType === 'custom' ? 'var(--primary)' : 'var(--border-color)'),
                                background: withdrawType === 'custom' ? 'var(--primary-light)' : 'var(--card-bg)',
                                color: withdrawType === 'custom' ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer'
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
                                style={{ paddingLeft: '3.25rem' }}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button variant="secondary" size="md" className="btn-full" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        className="btn-full"
                        loading={loading}
                        disabled={balance <= 0 || (isBank && banks.length === 0) || (withdrawType === 'custom' && (!customAmount || Number(customAmount) <= 0))}
                        onClick={() => onConfirm(isBank ? banks[selectedBankIndex] : null)}
                    >
                        Confirm Withdrawal
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
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
            onClick={onClose}
        >
            <div className="auth-card" style={{ maxWidth: '420px', width: '90%', padding: '2rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '64px', height: '64px', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <CheckCircle size={36} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('transferRequested')}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{t('pendingAdminReview')}</p>

                <div style={{ background: 'var(--card-bg-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Amount Requested</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{data.amount.toFixed(2)} ETB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Payout Method</span>
                        <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{user?.payoutMethod || 'telebirr'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Remaining Balance</span>
                        <span style={{ fontWeight: 700 }}>{data.newBalance.toFixed(2)} ETB</span>
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

                {/* Top Greeting & Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>
                                {t('welcome')}, {user?.name?.split(' ')[0] || 'Creator'} 👋
                            </h1>
                            <Badge variant={user?.kycStatus === 'approved' ? 'success' : user?.kycStatus === 'pending' ? 'info' : 'warning'} size="sm" icon={ShieldCheck}>
                                {user?.kycStatus === 'approved' ? 'KYC Verified' : user?.kycStatus === 'pending' ? 'KYC Reviewing' : 'KYC Unverified'}
                            </Badge>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.15rem' }}>
                            Here is your creator monetization overview for today.
                        </p>
                    </div>

                    <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <NotificationDrawer />
                        <a href={tipUrl} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" icon={ExternalLink} iconPosition="right">
                                {t('viewPublicPage')}
                            </Button>
                        </a>
                    </div>
                </div>

                {/* KYC Notice if required */}
                {user?.kycStatus !== 'approved' && (
                    <div style={{ background: 'rgba(217, 119, 6, 0.08)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <AlertTriangle size={20} color="var(--warning)" style={{ flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    {user?.kycStatus === 'pending' ? 'Identity verification in review' : 'KYC Verification Required'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {user?.kycStatus === 'pending' ? 'Our compliance team is verifying your ID. Withdrawals will unlock once approved.' : 'Verify your national ID or passport to enable direct bank & Telebirr withdrawals.'}
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

                {/* 3 Metric Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    {/* Available Balance */}
                    <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('currentBalance')}</span>
                            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wallet size={16} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                            {metrics.pending_balance.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>ETB</span>
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            className="btn-full"
                            disabled={metrics.pending_balance <= 0 || user?.kycStatus !== 'approved'}
                            onClick={() => setShowWithdrawModal(true)}
                        >
                            {t('withdrawFunds')}
                        </Button>
                    </Card>

                    {/* Lifetime Tips */}
                    <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('totalTips')}</span>
                            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                            {metrics.total_earned.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>ETB</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Lifetime total received from supporters
                        </div>
                    </Card>

                    {/* Active Payout Method */}
                    <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Payout Routing</span>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={16} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                            {user?.payoutMethod === 'bank' ? (bankAccounts[0]?.bankName || 'Bank Transfer') : 'Telebirr Wallet'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {user?.payoutMethod === 'bank' ? (bankAccounts[0]?.accountNumber || 'Configured in Settings') : (user?.telebirr_number || user?.phone || 'Configured')}
                        </div>
                    </Card>
                </div>

                {/* 2-Column Row: Share Link & OBS Stream Overlay */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {/* Tipping Link Card */}
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{t('tippingLinkTitle')}</h3>
                            <Badge variant="primary" size="sm">Share</Badge>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
                            {t('tippingLinkDesc')}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg-subtle)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', paddingLeft: '0.25rem' }}>
                                {tipUrl}
                            </span>
                            <Button variant="primary" size="sm" icon={copied ? CheckCircle : Copy} onClick={copyToClipboard}>
                                {copied ? t('copied') : t('copy')}
                            </Button>
                        </div>
                    </Card>

                    {/* OBS Stream Overlay Card */}
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Sparkles size={16} color="var(--secondary)" /> {t('obsOverlayTitle')}
                            </h3>
                            <Badge variant="warning" size="sm">OBS 1080p</Badge>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
                            Add as Browser Source in OBS Studio for real-time live tip sound alerts.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--card-bg-subtle)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
                                {obsUrl}
                            </span>
                            <Button variant="secondary" size="sm" icon={obsCopied ? CheckCircle : Copy} onClick={copyObsUrl}>
                                {obsCopied ? t('copied') : 'Copy URL'}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* 2-Column: Recent Activity Table (60%) & Top Fans Leaderboard (40%) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Recent Transactions Table */}
                    <Card style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('recentTransactions')}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{transactions.length} records</span>
                        </div>

                        {transactions.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <History size={32} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('noTransactionsYet')}</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Your incoming tips and withdrawals will appear here.</div>
                            </div>
                        ) : (
                            <div className="table-responsive-wrapper" style={{ border: 'none' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type / Tipper</th>
                                            <th style={{ textAlign: 'right' }}>Amount</th>
                                            <th style={{ textAlign: 'right' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.slice(0, 8).map((tx) => (
                                            <tr key={tx._id}>
                                                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                    {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: tx.type === 'tip' ? 'var(--success-light)' : 'var(--danger-light)', color: tx.type === 'tip' ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            {tx.type === 'tip' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                                                                {tx.type === 'tip' ? maskPhone(tx.tipperPhone) : 'Withdrawal Request'}
                                                            </div>
                                                            {tx.message && (
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    "{tx.message}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '0.9rem', color: tx.type === 'tip' ? 'var(--success)' : 'var(--text-main)' }}>
                                                    {tx.type === 'tip' ? '+' : '-'}{tx.amount.toFixed(2)} ETB
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
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
                    </Card>

                    {/* Top Fans Leaderboard */}
                    <Card style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('leaderboardTitle')}</h3>
                            <Badge variant="primary" size="sm">Top Fans</Badge>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <User size={32} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('noTipsYet')}</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{t('noTipsSubtitle')}</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {leaderboard.map((fan, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.65rem 0.85rem',
                                            background: 'var(--card-bg-subtle)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: idx === 0 ? '#FBBC05' : idx === 1 ? '#94A3B8' : idx === 2 ? '#B45309' : 'var(--border-color)',
                                                color: 'white',
                                                fontWeight: 800,
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
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {maskPhone(fan._id)}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>
                                            {fan.totalTipped.toFixed(2)} ETB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Payout Details & Multi-Bank Manager Section */}
                <Card style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('payoutDetailsTitle')}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('payoutDetailsDesc')}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSavePayoutSettings}>
                        {/* Payout Method Toggle */}
                        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--card-bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', width: 'fit-content', border: '1px solid var(--border-color)' }}>
                            <button
                                type="button"
                                onClick={() => setPayoutMethod('telebirr')}
                                style={{
                                    padding: '0.45rem 1.25rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: payoutMethod === 'telebirr' ? 'var(--card-bg)' : 'transparent',
                                    color: payoutMethod === 'telebirr' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: payoutMethod === 'telebirr' ? 'var(--shadow-xs)' : 'none'
                                }}
                            >
                                Telebirr
                            </button>
                            <button
                                type="button"
                                onClick={() => setPayoutMethod('bank')}
                                style={{
                                    padding: '0.45rem 1.25rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: payoutMethod === 'bank' ? 'var(--card-bg)' : 'transparent',
                                    color: payoutMethod === 'bank' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: payoutMethod === 'bank' ? 'var(--shadow-xs)' : 'none'
                                }}
                            >
                                Bank Accounts
                            </button>
                        </div>

                        {payoutMethod === 'telebirr' ? (
                            <div style={{ background: 'var(--card-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                    {t('telebirrWithdrawNotice')}{' '}
                                    <strong style={{ color: 'var(--primary)' }}>{user?.telebirr_number || user?.phone}</strong>
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                {bankAccounts.map((account, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '1.25rem',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--card-bg-subtle)',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {/* Circular Bank Logo / Initials with Edit Overlay */}
                                                <label
                                                    title="Upload / Change logo"
                                                    style={{ position: 'relative', width: '38px', height: '38px', cursor: 'pointer', flexShrink: 0 }}
                                                >
                                                    {account.logoUrl ? (
                                                        <img src={account.logoUrl} alt="Bank Logo" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                                                    ) : (
                                                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: getBankColor(account.bankName), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                            {getBankInitials(account.bankName)}
                                                        </div>
                                                    )}
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
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Bank Account {index + 1}</span>
                                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                                                        <Upload size={10} style={{ display: 'inline', marginRight: '3px' }} />
                                                        {account.logoUrl ? 'Change Logo' : 'Upload Custom Logo'}
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
                                                    style={{ background: 'var(--danger-light)', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}
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
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setBankAccounts([...bankAccounts, { bankName: '', accountNumber: '', accountHolderName: '', logoUrl: '' }])}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--primary)',
                                        border: '1px dashed var(--border-color)',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
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
                </Card>

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
