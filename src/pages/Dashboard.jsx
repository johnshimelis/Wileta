import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LogOut, Copy, CheckCircle, Wallet, History, ArrowUpRight,
    TrendingUp, AlertTriangle, ShieldCheck, XCircle, LayoutDashboard,
    User, Link as LinkIcon, Settings, Bell, X, AlertCircle, Menu
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import TopAlert from '../components/TopAlert';
import NotificationDrawer from '../components/NotificationDrawer';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';

// Standalone Modal Components
const WithdrawModal = ({
    show, onClose, withdrawType, setWithdrawType, balance,
    customAmount, setCustomAmount, onConfirm, loading, user
}) => {
    const { t } = useLanguage();
    if (!show) return null;
    return (
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', animation: 'fade-in 0.3s ease-out' }}
            onClick={onClose}
        >
            <div className="auth-card" style={{ maxWidth: '440px', width: '90%', padding: '2.5rem', transform: 'none', animation: 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Wallet size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('withdrawFunds')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('sendBalanceNotice')}</p>
                </div>

                {/* Destination Display & Selection */}
                <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t('payoutDestination')}:</span>
                    </div>
                    {user?.payoutMethod === 'bank' ? (
                        <div>
                            <span style={{ fontWeight: 600 }}>Bank:</span> {user.bankDetails?.bankName}<br/>
                            <span style={{ fontWeight: 600 }}>Account:</span> {user.bankDetails?.accountNumber}<br/>
                            <span style={{ fontWeight: 600 }}>Holder:</span> {user.bankDetails?.accountHolderName}
                        </div>
                    ) : (
                        <div>
                            <span style={{ fontWeight: 600 }}>Telebirr Number:</span> {user?.telebirr_number || user?.phone}
                        </div>
                    )}
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        * To change this, update your Payout Settings below.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div
                        onClick={() => setWithdrawType('all')}
                        style={{ padding: '1.25rem', borderRadius: '1rem', border: `2px solid ${withdrawType === 'all' ? 'var(--primary)' : 'var(--border-color)'}`, background: withdrawType === 'all' ? 'var(--primary-light)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{t('withdrawAll')}</span>
                            {withdrawType === 'all' && <CheckCircle size={18} color="var(--primary)" />}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transfer your full {balance.toFixed(2)} ETB</p>
                    </div>

                    <div
                        onClick={() => setWithdrawType('custom')}
                        style={{ padding: '1.25rem', borderRadius: '1rem', border: `2px solid ${withdrawType === 'custom' ? 'var(--primary)' : 'var(--border-color)'}`, background: withdrawType === 'custom' ? 'var(--primary-light)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{t('customAmountPlaceholder')}</span>
                            {withdrawType === 'custom' && <CheckCircle size={18} color="var(--primary)" />}
                        </div>
                        {withdrawType === 'custom' && (
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-input"
                                    placeholder="Enter amount in ETB"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onClose} className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', boxShadow: 'none' }}>{t('cancel')}</button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || (withdrawType === 'custom' && (!customAmount || Number(customAmount) <= 0))}
                        className="btn-primary"
                        style={{ flex: 1 }}
                    >
                        {loading ? <span className="spinner"></span> : t('confirm')}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};

const WithdrawSuccessModal = ({ data, onClose, user }) => {
    const { t } = useLanguage();
    if (!data) return null;
    return (
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', animation: 'fade-in 0.3s ease-out' }}
            onClick={onClose}
        >
            <div className="auth-card" style={{ maxWidth: '440px', width: '90%', padding: '2.5rem', textAlign: 'center', animation: 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                <div style={{ width: '80px', height: '80px', background: 'var(--success)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                    <CheckCircle size={40} />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('transferRequested')}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('pendingAdminReview')}</p>

                <div style={{ background: 'var(--bg-color)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('amountRequested')}</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{data.amount.toFixed(2)} ETB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('payoutMethod')}</span>
                        <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{user?.payoutMethod || 'telebirr'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('recipientDestination')}</span>
                        <span style={{ fontWeight: 700 }}>
                            {user?.payoutMethod === 'bank' ? `${user.bankDetails?.bankName} (...${user.bankDetails?.accountNumber?.slice(-4)})` : (user?.telebirr_number || user?.phone)}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('newBalance')}</span>
                        <span style={{ fontWeight: 700 }}>{data.newBalance.toFixed(2)} ETB</span>
                    </div>
                </div>

                <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>{t('greatThanks')}</button>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { user, logout, api, setUser } = useAuth();
    const { triggerNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    // Core Metrics and data
    const [metrics, setMetrics] = useState({ total_earned: 0, pending_balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form inputs and UI States
    const [copied, setCopied] = useState(false);
    const [obsCopied, setObsCopied] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [showVerifiedBanner, setShowVerifiedBanner] = useState(
        localStorage.getItem(`dismissed_verified_${user?._id}`) !== 'true'
    );
    const [alert, setAlert] = useState(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawType, setWithdrawType] = useState('all'); // 'all' | 'custom'
    const [customAmount, setCustomAmount] = useState('');
    const [withdrawSuccessData, setWithdrawSuccessData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Payout settings states
    const [payoutMethod, setPayoutMethod] = useState(user?.payoutMethod || 'telebirr');
    
    // Initialize with existing bankAccounts array, OR legacy bankDetails object, OR one empty form
    const initialBankAccounts = user?.bankAccounts?.length > 0 
        ? user.bankAccounts 
        : (user?.bankDetails?.bankName ? [user.bankDetails] : [{ bankName: '', accountNumber: '', accountHolderName: '' }]);
        
    const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
    const [savingPayout, setSavingPayout] = useState(false);

    // Sync settings states when user loads
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

    // Close menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [metricsRes, txRes, leaderboardRes] = await Promise.all([
                api.get('/dashboard/metrics'),
                api.get('/dashboard/transactions'),
                api.get('/dashboard/leaderboard').catch(err => {
                    console.error("Leaderboard fetch failed:", err);
                    return { data: [] };
                })
            ]);
            setMetrics(metricsRes.data);
            setTransactions(txRes.data);
            setLeaderboard(leaderboardRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
        setIsLoading(false);
    };

    const tipUrl = `${window.location.origin}/${user?.username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tipUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const dismissVerifiedBanner = () => {
        setShowVerifiedBanner(false);
        localStorage.setItem(`dismissed_verified_${user?._id}`, 'true');
    };

    useEffect(() => {
        let pollInterval;
        if (user?.kycStatus === 'pending') {
            pollInterval = setInterval(async () => {
                try {
                    const res = await api.get('/auth/me');
                    if (res.data.kycStatus !== 'pending') {
                        setUser(res.data);
                        clearInterval(pollInterval);
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                }
            }, 5000);
        }
        return () => clearInterval(pollInterval);
    }, [user?.kycStatus, api, setUser]);

    const handleWithdraw = async () => {
        // Strict KYC Guard
        if (user?.kycStatus !== 'approved') {
            setShowWithdrawModal(false);
            triggerNotification({
                title: 'Withdrawal Blocked',
                message: user?.kycStatus === 'pending'
                    ? 'Your KYC is still under review. You can withdraw once approved.'
                    : 'Identity verification required before withdrawing. Please complete KYC first.',
                type: 'error'
            });
            return;
        }

        const amount = withdrawType === 'custom' ? customAmount : null;

        if (withdrawType === 'custom' && (isNaN(amount) || parseFloat(amount) <= 0)) {
            triggerNotification({ title: 'Invalid Amount', message: 'Please enter a valid amount', type: 'warning' });
            return;
        }

        if (withdrawType === 'custom' && parseFloat(amount) > metrics.pending_balance) {
            triggerNotification({ title: 'Insufficient Balance', message: 'The amount exceeds your pending balance.', type: 'warning' });
            return;
        }

        setIsWithdrawing(true);
        try {
            const res = await api.post('/dashboard/withdraw', { amount });
            setMetrics(prev => ({ ...prev, pending_balance: res.data.newBalance }));
            setShowWithdrawModal(false);
            setWithdrawSuccessData(res.data);
            setCustomAmount('');
            triggerNotification({
                title: 'Withdrawal Initialized',
                message: 'Your transfer request has been successfully created and queued.',
                type: 'success'
            });
            // Refresh transactions log
            const txRes = await api.get('/dashboard/transactions');
            setTransactions(txRes.data);
        } catch (error) {
            triggerNotification({
                title: 'Withdrawal Failed',
                message: error.response?.data?.error || "An error occurred.",
                type: 'error'
            });
        }
        setIsWithdrawing(false);
    };

    const handleSavePayoutSettings = async (e) => {
        e.preventDefault();
        setSavingPayout(true);
        try {
            const payload = {
                payoutMethod,
                bankAccounts: payoutMethod === 'bank' ? bankAccounts : undefined
            };
            const res = await api.post('/auth/update-profile', payload);
            setUser(res.data);
            triggerNotification({
                title: 'Settings Saved',
                message: 'Your payout settings have been updated successfully.',
                type: 'success'
            });
        } catch (err) {
            triggerNotification({
                title: 'Save Failed',
                message: err.response?.data?.error || 'Failed to update payout settings.',
                type: 'error'
            });
        }
        setSavingPayout(false);
    };

    const maskPhone = (phone) => {
        if (!phone) return 'Supporter';
        const clean = phone.replace(/\D/g, '');
        if (clean.length < 8) return phone;
        return `${clean.slice(0, 4)}***${clean.slice(-4)}`;
    };

    if (isLoading) {
        return (
            <div className="auth-container">
                <div className="spinner" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent', width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <style>{`
                @media (max-width: 768px) {
                    .desktop-only-header { display: none !important; }
                }
            `}</style>
            
            <div className="mobile-header-container mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Logo size="small" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <NotificationDrawer />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="main-content">
                {alert && <TopAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
                
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

                <WithdrawSuccessModal
                    data={withdrawSuccessData}
                    onClose={() => setWithdrawSuccessData(null)}
                    user={user}
                />

                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div className="creator-avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem', margin: 0, flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            {user?.profilePicUrl ? (
                                <img src={user.profilePicUrl.startsWith('http') ? user.profilePicUrl : `https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.name?.charAt(0) || '?'
                            )}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{t('welcome')}, {user?.name.split(' ')[0]}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {user?.kycStatus === 'approved' ? t('activeStatus') : t('kycUnverifiedStatus')}
                                {user?.kycStatus === 'approved' && <CheckCircle size={14} color="var(--primary)" />}
                            </p>
                        </div>
                    </div>
                    <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <NotificationDrawer />
                    </div>
                </header>

                {/* Status Banners */}
                {user?.kycStatus === 'none' && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <AlertTriangle size={24} color="var(--warning)" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{t('kycRequiredAlert')}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{t('kycRequiredText')}</p>
                            <button onClick={() => navigate('/kyc')} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>{t('completeVerification')}</button>
                        </div>
                    </div>
                )}

                {user?.kycStatus === 'pending' && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--secondary)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <ShieldCheck size={24} color="var(--secondary)" style={{ flexShrink: 0 }} />
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{t('kycPendingStatus')}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('kycPendingText')}</p>
                        </div>
                    </div>
                )}

                {user?.kycStatus === 'rejected' && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <XCircle size={24} color="var(--danger)" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{t('kycRejected')}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>{t('kycRejectedText')}</p>
                            <button onClick={() => navigate('/kyc')} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--danger)' }}>{t('retryNow')}</button>
                        </div>
                    </div>
                )}

                {user?.kycStatus === 'approved' && showVerifiedBanner && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid var(--success)', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        <div className="auth-icon" style={{ width: '48px', height: '48px', margin: 0, background: 'var(--success)' }}>
                            <CheckCircle size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{t('kycApproved')}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('kycApprovedText')}</p>
                        </div>
                        <button onClick={dismissVerifiedBanner} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Share Link Section */}
                <div className="dashboard-card animate-fade-in delay-1" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{t('tippingLinkTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>{t('tippingLinkDesc')}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', width: '100%', overflow: 'hidden' }}>
                        <a
                            href={tipUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: '0.5rem 1rem', flex: 1, minWidth: 0, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}
                            title="Open tipping page"
                        >
                            {tipUrl}
                        </a>
                        <button
                            onClick={copyToClipboard}
                            style={{ background: 'var(--primary)', border: 'none', cursor: 'pointer', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, transition: 'all 0.2s', flexShrink: 0 }}
                        >
                            {copied ? <><CheckCircle size={18} /> {t('copied')}</> : <><Copy size={18} /> {t('copy')}</>}
                        </button>
                    </div>
                </div>

                {/* OBS Alert Overlay Section */}
                <div className="dashboard-card animate-fade-in delay-1" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                            <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '0.5rem', background: 'rgba(15, 157, 88, 0.1)', color: '#0F9D58' }}>⚡</span>
                            {t('obsOverlayTitle')}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('obsOverlayDesc')}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', width: '100%', overflow: 'hidden' }}>
                        <span
                            style={{ padding: '0.5rem 1rem', flex: 1, minWidth: 0, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}
                            title="OBS Browser Source URL"
                        >
                            {window.location.origin}/overlay/{user?._id}
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/overlay/${user?._id}`);
                                setObsCopied(true);
                                setTimeout(() => setObsCopied(false), 2000);
                            }}
                            style={{ background: 'var(--primary)', border: 'none', cursor: 'pointer', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, transition: 'all 0.2s', flexShrink: 0 }}
                        >
                            {obsCopied ? <><CheckCircle size={16} /> {t('copied')}</> : <><Copy size={16} /> {t('shareTippingLink')}</>}
                        </button>
                    </div>
                </div>

                <div className="dashboard-grid animate-fade-in delay-2">
                    {/* Card 1: Wallet Balance */}
                    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wallet size={20} />
                            </div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('currentBalance')}</h3>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em' }}>
                            {metrics.pending_balance.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ETB</span>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => setShowWithdrawModal(true)}
                            disabled={metrics.pending_balance <= 0 || isWithdrawing || user?.kycStatus !== 'approved'}
                            style={{ width: '100%', padding: '1rem' }}
                        >
                            {t('withdrawFunds')}
                        </button>
                        {user?.kycStatus !== 'approved' && (
                            <div style={{ color: 'var(--danger)', fontSize: '0.8rem', textAlign: 'center', marginTop: '-0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                <AlertCircle size={14} />
                                {user?.kycStatus === 'pending' ? 'Verification is in progress. Withdrawals paused.' : 'You must verify your identity (KYC) to withdraw.'}
                            </div>
                        )}
                    </div>

                    {/* Card 2: Lifetime Earnings */}
                    <div className="dashboard-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={20} />
                            </div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('totalTips')}</h3>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em' }}>
                            {metrics.total_earned.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ETB</span>
                        </div>
                        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {t('earningsSubtitle')}
                        </div>
                    </div>
                </div>

                {/* Additional Row: Leaderboard and Payout Settings */}
                <div className="dashboard-grid animate-fade-in delay-2" style={{ marginTop: '2.5rem' }}>
                    {/* Leaderboard Card */}
                    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(251, 188, 5, 0.1)', color: '#FBBC05', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>{t('leaderboardTitle')}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{t('leaderboardDesc')}</p>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                            {leaderboard.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem' }}>{t('noTipsYet')}</p>
                                    <p style={{ fontSize: '0.8rem', margin: 0 }}>{t('noTipsSubtitle')}</p>
                                </div>
                            ) : (
                                leaderboard.map((fan, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-color)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: 800,
                                            background: index === 0 ? '#FBBC05' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : 'var(--border-color)',
                                            color: index < 3 ? 'white' : 'var(--text-muted)'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>
                                                {maskPhone(fan._id)}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {t('lastTip')}: {new Date(fan.lastTipAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                                            {fan.totalTipped.toFixed(2)} ETB
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Payout Settings Card */}
                    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(147, 51, 234, 0.1)', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Settings size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, margin: 0 }}>{t('payoutDetailsTitle')}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{t('payoutDetailsDesc')}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSavePayoutSettings} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('payoutOption')}</label>
                                <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: '0.75rem', padding: '3px', border: '1px solid var(--border-color)' }}>
                                    <button
                                        type="button"
                                        onClick={() => setPayoutMethod('telebirr')}
                                        style={{
                                            flex: 1, padding: '0.5rem', borderRadius: '0.6rem', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                                            background: payoutMethod === 'telebirr' ? 'var(--card-bg)' : 'transparent',
                                            color: payoutMethod === 'telebirr' ? 'var(--primary)' : 'var(--text-muted)',
                                            boxShadow: payoutMethod === 'telebirr' ? 'var(--shadow-sm)' : 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        Telebirr
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPayoutMethod('bank')}
                                        style={{
                                            flex: 1, padding: '0.5rem', borderRadius: '0.6rem', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                                            background: payoutMethod === 'bank' ? 'var(--card-bg)' : 'transparent',
                                            color: payoutMethod === 'bank' ? 'var(--primary)' : 'var(--text-muted)',
                                            boxShadow: payoutMethod === 'bank' ? 'var(--shadow-sm)' : 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        Bank Transfer
                                    </button>
                                </div>
                            </div>

                            {payoutMethod === 'telebirr' ? (
                                <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                                        {t('telebirrWithdrawNotice')} 
                                        <strong style={{ display: 'block', marginTop: '0.25rem', color: 'var(--text-main)' }}>
                                            {user?.telebirr_number || user?.phone}
                                        </strong>
                                    </p>
                                </div>
                            ) : (
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
                            )}

                            <button
                                type="submit"
                                disabled={savingPayout}
                                className="btn-primary"
                                style={{ width: '100%', padding: '0.75rem', marginTop: 'auto' }}
                            >
                                {savingPayout ? <span className="spinner"></span> : t('savePayoutDetails')}
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2.5rem 0 1.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <History size={20} color="var(--primary)" /> {t('activityLog')}
                    </h2>
                </div>

                <div className="table-container animate-fade-in delay-3">
                    {transactions.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                            <User size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t('noActivity')}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('noActivityDesc')}</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('dateLabel')}</th>
                                    <th>{t('sourceTypeLabel')}</th>
                                    <th>{t('amountHeaderLabel')}</th>
                                    <th>{t('statusHeaderLabel')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id}>
                                        <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            {tx.type === 'withdrawal' ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                                                    <ArrowUpRight size={14} /> {t('withdrawalRequest')}
                                                </span>
                                            ) : (
                                                <div>
                                                    {maskPhone(tx.tipperPhone)}
                                                    {tx.message && (
                                                        <div style={{
                                                            fontSize: '0.8rem',
                                                            color: 'var(--text-muted)',
                                                            marginTop: '0.25rem',
                                                            fontStyle: 'italic',
                                                            fontWeight: 400
                                                        }}>
                                                            "{tx.message}"
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{
                                            color: tx.type === 'withdrawal' ? 'var(--text-main)' : 'var(--primary)',
                                            fontWeight: 700
                                        }}>
                                            {tx.type === 'withdrawal' ? '-' : '+'}{tx.netAmount.toFixed(2)} ETB
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '2rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                background: tx.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : tx.status === 'failed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: tx.status === 'success' ? 'var(--success)' : tx.status === 'failed' ? 'var(--danger)' : 'var(--warning)',
                                                textTransform: 'capitalize'
                                            }}>
                                                {t(tx.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main >
        </div>
    );
}
