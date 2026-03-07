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

// Standalone Modal Components (Defined outside to prevent re-mounting)
const WithdrawModal = ({
    show, onClose, withdrawType, setWithdrawType, balance,
    customAmount, setCustomAmount, onConfirm, loading
}) => {
    if (!show) return null;
    return (
        <div
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', animation: 'fade-in 0.3s ease-out' }}
            onClick={onClose}
        >
            <div className="auth-card" style={{ maxWidth: '440px', width: '90%', padding: '2.5rem', transform: 'none', animation: 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Wallet size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Withdraw Funds</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Send your balance to your Telebirr account</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div
                        onClick={() => setWithdrawType('all')}
                        style={{ padding: '1.25rem', borderRadius: '1rem', border: `2px solid ${withdrawType === 'all' ? 'var(--primary)' : 'var(--border-color)'}`, background: withdrawType === 'all' ? 'var(--primary-light)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Withdraw All</span>
                            {withdrawType === 'all' && <CheckCircle size={18} color="var(--primary)" />}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transfer your full {balance.toFixed(2)} ETB</p>
                    </div>

                    <div
                        onClick={() => setWithdrawType('custom')}
                        style={{ padding: '1.25rem', borderRadius: '1rem', border: `2px solid ${withdrawType === 'custom' ? 'var(--primary)' : 'var(--border-color)'}`, background: withdrawType === 'custom' ? 'var(--primary-light)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Custom Amount</span>
                            {withdrawType === 'custom' && <CheckCircle size={18} color="var(--primary)" />}
                        </div>
                        {withdrawType === 'custom' && (
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <input
                                    type="number"
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
                    <button onClick={onClose} className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', boxShadow: 'none' }}>Cancel</button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || (withdrawType === 'custom' && !customAmount)}
                        className="btn-primary"
                        style={{ flex: 1 }}
                    >
                        {loading ? <span className="spinner"></span> : 'Confirm'}
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

const WithdrawSuccessModal = ({ data, onClose, telebirr_number }) => {
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
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Transfer Successful!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your funds have been sent to your Telebirr wallet.</p>

                <div style={{ background: 'var(--bg-color)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Amount Sent</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{data.amount.toFixed(2)} ETB</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Recipient</span>
                        <span style={{ fontWeight: 700 }}>{telebirr_number}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>New Balance</span>
                        <span style={{ fontWeight: 700 }}>{data.newBalance.toFixed(2)} ETB</span>
                    </div>
                </div>

                <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>Great, Thanks!</button>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { user, logout, api, setUser } = useAuth();
    const { triggerNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const [metrics, setMetrics] = useState({ total_earned: 0, pending_balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [copied, setCopied] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showVerifiedBanner, setShowVerifiedBanner] = useState(
        localStorage.getItem(`dismissed_verified_${user?._id}`) !== 'true'
    );
    const [alert, setAlert] = useState(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawType, setWithdrawType] = useState('all'); // 'all' | 'custom'
    const [customAmount, setCustomAmount] = useState('');
    const [withdrawSuccessData, setWithdrawSuccessData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close menu on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [metricsRes, txRes] = await Promise.all([
                api.get('/dashboard/metrics'),
                api.get('/dashboard/transactions')
            ]);
            setMetrics(metricsRes.data);
            setTransactions(txRes.data);
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
        // Strict KYC Guard — must be first
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
                message: 'Your transfer to Telebirr has been successfully initiated.',
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

    if (isLoading) {
        return (
            <div className="auth-container">
                <div className="spinner" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent', width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={20} />
                <span className="nav-text">{label}</span>
            </Link>
        );
    };

    return (
        <div className="app-layout">
            <div className="mobile-header-container mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.jpg" alt="Wileta Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Wileta</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}>
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
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
                />
                <WithdrawSuccessModal
                    data={withdrawSuccessData}
                    onClose={() => setWithdrawSuccessData(null)}
                    telebirr_number={user?.telebirr_number}
                />
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div className="creator-avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem', margin: 0, flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            {user?.profilePicUrl ? (
                                <img src={`https://wileta-backend.onrender.com${user.profilePicUrl}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user?.name?.charAt(0) || '?'
                            )}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Welcome, {user?.name.split(' ')[0]}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Account {user?.kycStatus === 'approved' ? 'fully verified' : 'partially set up'}
                                {user?.kycStatus === 'approved' && <CheckCircle size={14} color="var(--primary)" />}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <NotificationDrawer />
                    </div>
                </header>

                {/* Status Banners */}
                {user?.kycStatus === 'none' && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <AlertTriangle size={24} color="var(--warning)" />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Identity Verification Required</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>Complete your KYC to enable Telebirr withdrawals.</p>
                            <button onClick={() => navigate('/kyc')} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Verify Now</button>
                        </div>
                    </div>
                )}

                {user?.kycStatus === 'pending' && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--secondary)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <ShieldCheck size={24} color="var(--secondary)" />
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Verification in Progress</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>We're reviewing your documents. This usually takes less than 24h.</p>
                        </div>
                    </div>
                )}

                {user?.kycStatus === 'rejected' && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <XCircle size={24} color="var(--danger)" />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Verification Rejected</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>Your documents were not accepted. Please retry with clearer photos.</p>
                            <button onClick={() => navigate('/kyc')} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--danger)' }}>Retry Now</button>
                        </div>
                    </div>
                )}

                {user?.kycStatus === 'approved' && showVerifiedBanner && (
                    <div className="dashboard-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid var(--success)', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        <div className="auth-icon" style={{ width: '48px', height: '48px', margin: 0, background: 'var(--success)' }}>
                            <CheckCircle size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Identity Verified!</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>You're all set to receive and withdraw tips.</p>
                        </div>
                        <button onClick={dismissVerifiedBanner} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Share Link Section */}
                <div className="dashboard-card animate-fade-in delay-1" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', color: 'white', border: 'none' }}>
                    <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem', color: 'white' }}>Quick Tipping Link</h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', fontWeight: 500 }}>Share this link to start receiving support</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '1rem', flex: '1', minWidth: '300px', border: '1px solid rgba(255,255,255,0.3)' }}>
                        <a
                            href={tipUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: '0.5rem 1rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'white', textDecoration: 'none' }}
                            title="Open tipping page"
                        >
                            {tipUrl}
                        </a>
                        <button
                            onClick={copyToClipboard}
                            style={{ background: 'white', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, transition: 'all 0.2s' }}
                        >
                            {copied ? <><CheckCircle size={18} /> Copied</> : <><Copy size={18} /> Copy</>}
                        </button>
                    </div>
                </div>

                <div className="dashboard-grid animate-fade-in delay-2">
                    <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wallet size={20} />
                            </div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Balance</h3>
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
                            Withdraw to Telebirr
                        </button>
                        {user?.kycStatus !== 'approved' && (
                            <div style={{ color: 'var(--danger)', fontSize: '0.8rem', textAlign: 'center', marginTop: '-0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                <AlertCircle size={14} />
                                {user?.kycStatus === 'pending' ? 'Verification is in progress. Withdrawals paused.' : 'You must verify your identity (KYC) to withdraw.'}
                            </div>
                        )}
                    </div>

                    <div className="dashboard-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={20} />
                            </div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Earnings</h3>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.04em' }}>
                            {metrics.total_earned.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ETB</span>
                        </div>
                        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Showing your lifetime earnings from all tips.
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2rem 0 1.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <History size={20} color="var(--primary)" /> Activity Log
                    </h2>
                </div>

                <div className="table-container animate-fade-in delay-3">
                    {transactions.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                            <User size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>No activity yet</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tips and withdrawals will appear here.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Source</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id}>
                                        <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            {tx.type === 'withdrawal' ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                                                    <ArrowUpRight size={14} /> Withdrawal
                                                </span>
                                            ) : (
                                                tx.tipperPhone || 'Anonymous Tipper'
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
                                                background: tx.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: tx.status === 'success' ? 'var(--success)' : 'var(--warning)',
                                                textTransform: 'capitalize'
                                            }}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}
