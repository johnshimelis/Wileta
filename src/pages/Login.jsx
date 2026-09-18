import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Phone, Lock, Eye, EyeOff, AlertCircle,
    ArrowLeft, Send, CheckCircle, ShieldCheck, Zap, Heart,
    Sparkles, Volume2, Users, TrendingUp, DollarSign,
    Smartphone, KeyRound
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import EthiopianFlag from '../components/EthiopianFlag';
import ComplianceBadge from '../components/ComplianceBadge';

export default function Login() {
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Forgot Password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotMethod, setForgotMethod] = useState('phone'); // 'phone' | 'email'
    const [resetEmail, setResetEmail] = useState('');
    const [resetPhone, setResetPhone] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetDeliveredChannels, setResetDeliveredChannels] = useState([]);

    // Interactive Right-side Showcase state
    const demoSupporters = [
        { name: 'Natnael Tadesse', role: 'Tech YouTuber Supporter', amount: '250', time: '10s ago', note: 'Loved your latest video! Gursha on me ☕' },
        { name: 'Bethlehem Assefa', role: 'Live Podcast Listener', amount: '500', time: '1m ago', note: 'Keep inspiring our community with great stories ❤️' },
        { name: 'Dawit Getachew', role: 'Gaming Stream Fan', amount: '100', time: '3m ago', note: 'Insane clutch in the tournament bro! 🚀' }
    ];
    const [activeDemoIdx, setActiveDemoIdx] = useState(0);
    const activeDemo = demoSupporters[activeDemoIdx];
    const [simulatedAlert, setSimulatedAlert] = useState(false);

    const { login, api, setUser } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const errParam = params.get('error');
        const platform = params.get('platform');
        const source = params.get('source');

        // If returned from mobile login flow, immediately bounce into Flutter mobile app
        if (token && (platform === 'mobile' || source === 'mobile')) {
            const intentUrl = `intent://auth/callback?token=${token}#Intent;scheme=gurshapay;package=com.gursha.pay;end`;
            const customScheme = `gurshapay://auth/callback?token=${token}`;
            try {
                window.location.replace(intentUrl);
            } catch (e) {}
            setTimeout(() => {
                window.location.href = customScheme;
            }, 300);
            return;
        }

        if (token) {
            localStorage.setItem('token', token);
            setLoading(true);
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data);
                    if (res.data.isOnboarded) {
                        navigate('/dashboard');
                    } else {
                        navigate('/onboarding');
                    }
                })
                .catch(err => {
                    console.error('Social login error:', err);
                    setError('Failed to log in with social account.');
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (errParam) {
            setError(errParam);
        }
    }, [navigate, api, setUser]);

    const triggerTestAlert = () => {
        setSimulatedAlert(true);
        setTimeout(() => setSimulatedAlert(false), 3500);
    };

    const handleSendOtp = async () => {
        if (!phone) {
            setError('Please enter your phone number first');
            return;
        }
        setError('');
        setSendingOtp(true);
        try {
            await api.post('/auth/request-otp', { phone });
            setOtpSent(true);
            setResendCountdown(60);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        }
        setSendingOtp(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        const identifier = forgotMethod === 'phone' ? resetPhone : resetEmail;
        if (!identifier) {
            setError(forgotMethod === 'phone' ? 'Please enter your phone number' : 'Please enter your email address');
            return;
        }
        setResetLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', {
                identifier,
                channel: forgotMethod === 'phone' ? 'sms' : 'email'
            });
            setResetDeliveredChannels(res.data?.deliveredChannels || []);
            setResetSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset code');
        }
        setResetLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        let res;
        if (loginMethod === 'email') {
            if (!email || !password) {
                setError(t('emailAndPassReq') || 'Email and password are required');
                setLoading(false);
                return;
            }
            res = await login({ email, password });
        } else {
            if (!phone || !otp) {
                setError(t('phoneAndOtpReq') || 'Phone and OTP code are required');
                setLoading(false);
                return;
            }
            res = await login({ phone, otp });
        }

        if (res.success) {
            if (res.user.isOnboarded) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        } else {
            setError(res.error || 'Invalid credentials');
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-color)' }}>
            {/* Left Column: Centered Modal Container */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.75rem 1.25rem',
                minHeight: '100vh',
                boxSizing: 'border-box',
                width: '100%'
            }}>
                {/* Top Controls Bar: Back icon on left, language & theme toggles on right */}
                <div style={{
                    width: '100%',
                    maxWidth: '440px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                }}>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        aria-label="Back to Home"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        title="Back to Home"
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>

                {/* Modal Card with Logo INSIDE */}
                <div 
                    className="auth-card-modal"
                    style={{
                        width: '100%',
                        maxWidth: '440px',
                        margin: 'auto 0',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Centered Bigger Brand Logo INSIDE the Modal with Tight Gap */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
                        <Logo size="large" />
                    </div>

                    {showForgotPassword ? (
                        <div>
                            <button
                                onClick={() => { setShowForgotPassword(false); setError(''); setResetSent(false); }}
                                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}
                            >
                                <ArrowLeft size={16} /> Back to sign in
                            </button>

                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.35rem' }}>Reset Password</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                                Choose how you want to receive your password reset verification code:
                            </p>

                            {resetSent ? (
                                <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <CheckCircle size={26} />
                                    </div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Reset Code Sent!</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.45 }}>
                                        {resetDeliveredChannels.length > 0 ? (
                                            <>Dispatched to: <strong>{resetDeliveredChannels.join(', ')}</strong></>
                                        ) : (
                                            <>Verification code dispatched successfully.</>
                                        )}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                        <Button
                                            variant="primary"
                                            size="md"
                                            className="btn-full"
                                            onClick={() => navigate('/reset-password')}
                                            icon={KeyRound}
                                        >
                                            Enter Code & Set Password
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            className="btn-full"
                                            onClick={() => setShowForgotPassword(false)}
                                        >
                                            Return to Sign In
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {/* Method Switcher Tabs */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.3rem',
                                        background: 'var(--card-bg-subtle, rgba(0,0,0,0.04))',
                                        padding: '0.25rem',
                                        borderRadius: '8px',
                                        marginBottom: '1.25rem',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => { setForgotMethod('phone'); setError(''); }}
                                            style={{
                                                padding: '0.5rem 0',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: forgotMethod === 'phone' ? 'var(--card-bg)' : 'transparent',
                                                color: forgotMethod === 'phone' ? 'var(--primary)' : 'var(--text-muted)',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.35rem',
                                                boxShadow: forgotMethod === 'phone' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Smartphone size={14} /> SMS & Telegram
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setForgotMethod('email'); setError(''); }}
                                            style={{
                                                padding: '0.5rem 0',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: forgotMethod === 'email' ? 'var(--card-bg)' : 'transparent',
                                                color: forgotMethod === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                                                fontWeight: 700,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.35rem',
                                                boxShadow: forgotMethod === 'email' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Mail size={14} /> Email Link
                                        </button>
                                    </div>

                                    {error && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                                            <AlertCircle size={16} /> {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleForgotPassword}>
                                        {forgotMethod === 'phone' ? (
                                            <div className="form-group">
                                                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{t('phoneNumber') || 'Phone Number'}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>SMS + Telegram</span>
                                                </label>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    height: '44px',
                                                    background: 'var(--card-bg)',
                                                    border: '1.5px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        padding: '0 0.75rem',
                                                        height: '100%',
                                                        background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.03))',
                                                        borderRight: '1px solid var(--border-color)',
                                                        userSelect: 'none'
                                                    }}>
                                                        <EthiopianFlag width={20} height={14} />
                                                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>+251</span>
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        inputMode="numeric"
                                                        placeholder="911000000"
                                                        value={resetPhone}
                                                        onChange={e => {
                                                            let val = e.target.value.replace(/[^0-9]/g, '');
                                                            if (val.startsWith('0')) val = val.substring(1);
                                                            setResetPhone(val.slice(0, 9));
                                                            setError('');
                                                        }}
                                                        maxLength={9}
                                                        style={{
                                                            flex: 1,
                                                            height: '100%',
                                                            border: 'none',
                                                            outline: 'none',
                                                            background: 'transparent',
                                                            padding: '0 0.75rem',
                                                            fontSize: '0.98rem',
                                                            fontWeight: 700,
                                                            letterSpacing: '1px',
                                                            color: 'var(--text-main)'
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="form-group">
                                                <label className="form-label">{t('emailAddress') || 'Email Address'}</label>
                                                <div className="input-group">
                                                    <Mail size={18} />
                                                    <input
                                                        type="email"
                                                        className="form-input"
                                                        placeholder="you@example.com"
                                                        value={resetEmail}
                                                        onChange={e => { setResetEmail(e.target.value); setError(''); }}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            className="btn-full"
                                            loading={resetLoading}
                                            icon={Send}
                                            style={{ marginTop: '0.5rem' }}
                                        >
                                            Send Reset Code
                                        </Button>

                                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                            <Link
                                                to="/reset-password"
                                                style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                                            >
                                                Have a code or link? Open Reset Password page &rarr;
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                                    {t('welcomeBack')}
                                </h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    {t('signInSubtitle')}
                                </p>
                            </div>

                            {/* Method Switcher Tabs */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.35rem',
                                background: 'var(--card-bg-subtle)',
                                padding: '0.25rem',
                                borderRadius: '8px',
                                marginBottom: '1.25rem',
                                border: '1px solid var(--border-color)'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('email'); setError(''); }}
                                    style={{
                                        padding: '0.55rem 0',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: loginMethod === 'email' ? 'var(--card-bg)' : 'transparent',
                                        color: loginMethod === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        boxShadow: loginMethod === 'email' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {t('emailMethod')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('phone'); setError(''); }}
                                    style={{
                                        padding: '0.55rem 0',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: loginMethod === 'phone' ? 'var(--card-bg)' : 'transparent',
                                        color: loginMethod === 'phone' ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        boxShadow: loginMethod === 'phone' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {t('phoneMethod')}
                                </button>
                            </div>

                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                {loginMethod === 'email' ? (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">{t('emailAddress')}</label>
                                            <div className="input-group">
                                                <Mail size={18} />
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                <label className="form-label">{t('password')}</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowForgotPassword(true)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    Forgot?
                                                </button>
                                            </div>
                                            <div className="input-group">
                                                <Lock size={18} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="form-input"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{ position: 'absolute', right: '0.85rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">{t('phoneNumber')}</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                                                <div 
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        height: '44px',
                                                        background: 'var(--card-bg)',
                                                        border: '1.5px solid var(--border-color)',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                                                    }}
                                                    className="phone-input-field"
                                                >
                                                    {/* Country Flag & Prefix Badge */}
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        padding: '0 0.75rem',
                                                        height: '100%',
                                                        background: 'var(--card-bg-subtle, rgba(0, 0, 0, 0.03))',
                                                        borderRight: '1px solid var(--border-color)',
                                                        flexShrink: 0,
                                                        userSelect: 'none'
                                                    }}>
                                                        <EthiopianFlag width={20} height={14} />
                                                        <span style={{
                                                            fontWeight: 800,
                                                            fontSize: '0.88rem',
                                                            color: 'var(--text-main)',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            +251
                                                        </span>
                                                    </div>

                                                    {/* 9-digit Phone Input: Strictly partitioned, zero overlap */}
                                                    <input
                                                        type="tel"
                                                        inputMode="numeric"
                                                        placeholder="911000000"
                                                        value={phone}
                                                        onChange={e => {
                                                            let val = e.target.value.replace(/[^0-9]/g, '');
                                                            if (val.startsWith('0')) val = val.substring(1);
                                                            setPhone(val.slice(0, 9));
                                                        }}
                                                        maxLength={9}
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            border: 'none',
                                                            outline: 'none',
                                                            background: 'transparent',
                                                            padding: '0 0.75rem',
                                                            fontSize: '0.98rem',
                                                            fontWeight: 700,
                                                            letterSpacing: '1px',
                                                            color: 'var(--text-main)',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        required
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="md"
                                                    onClick={handleSendOtp}
                                                    loading={sendingOtp}
                                                    disabled={resendCountdown > 0}
                                                    style={{ 
                                                        flexShrink: 0,
                                                        padding: '0 0.95rem',
                                                        height: '44px',
                                                        fontSize: '0.825rem',
                                                        fontWeight: 700,
                                                        whiteSpace: 'nowrap',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    {resendCountdown > 0 ? `${resendCountdown}s` : (otpSent ? 'Resend' : t('getOtp'))}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">{t('otpCode')}</label>
                                            <div className="input-group">
                                                <Lock size={18} />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="123456"
                                                    value={otp}
                                                    onChange={e => setOtp(e.target.value)}
                                                    maxLength={6}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        height: '46px',
                                        background: 'var(--primary)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        marginTop: '0.75rem',
                                        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {loading ? <span className="spinner"></span> : t('signInButton')}
                                </button>
                            </form>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                                <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{t('orSignInWith')}</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            </div>

                            {/* Google OAuth Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    const backendUrl = import.meta.env.VITE_API_URL 
                                        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
                                        : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                            ? 'http://localhost:5000'
                                            : 'https://wileta-backend.onrender.com');
                                    const origin = encodeURIComponent(window.location.origin);
                                    window.location.href = `${backendUrl}/api/auth/google?origin=${origin}&platform=web`;
                                }}
                                style={{
                                    width: '100%',
                                    height: '46px',
                                    background: 'var(--card-bg-subtle)',
                                    color: 'var(--text-main)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.65rem',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'var(--border-color)';
                                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'var(--card-bg-subtle)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                                </svg>
                                {t('googleButton')}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem', marginBottom: 0 }}>
                                {t('dontHaveAccount')}{' '}
                                <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                    {t('signUpLink')}
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                <ComplianceBadge />
            </div>

            {/* Right Column: Centered Rich Interactive Showcase (Desktop Only) */}
            <div className="desktop-only" style={{
                flex: 1.15,
                background: 'linear-gradient(145deg, #064E3B 0%, #047857 50%, #059669 100%)',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem 2.5rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    pointerEvents: 'none'
                }}></div>

                <div style={{ maxWidth: '460px', width: '100%', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Sparkles size={14} color="#FBBF24" /> Ethiopian Creator Economy <EthiopianFlag width={18} height={12} style={{ marginLeft: '4px' }} />
                        </span>
                        {simulatedAlert && (
                            <span style={{ background: '#10B981', color: 'white', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, animation: 'pulse 1s infinite' }}>
                                🔔 Stream Alert LIVE
                            </span>
                        )}
                    </div>

                    <h2 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '0.85rem', letterSpacing: '-0.025em' }}>
                        Receive Direct Support. Grow Your Passion.
                    </h2>
                    
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                        Empowering 5,000+ Ethiopian YouTubers, Streamers, and Podcasters with instant Telebirr & Multi-Bank direct payouts.
                    </p>

                    {/* Interactive Creator Switcher Tabs */}
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                        {demoSupporters.map((d, i) => (
                            <button
                                key={d.name}
                                type="button"
                                onClick={() => setActiveDemoIdx(i)}
                                style={{
                                    flex: 1,
                                    padding: '0.45rem 0.5rem',
                                    borderRadius: '6px',
                                    border: activeDemoIdx === i ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                                    background: activeDemoIdx === i ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)',
                                    color: '#FFFFFF',
                                    fontSize: '0.75rem',
                                    fontWeight: activeDemoIdx === i ? 800 : 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {d.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>

                    {/* Interactive Live Tipping Receipt Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FFFFFF', color: '#064E3B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.95rem', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                                    {activeDemo.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{activeDemo.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{activeDemo.role} • {activeDemo.time}</div>
                                </div>
                            </div>
                            <span style={{ background: '#10B981', color: '#FFFFFF', fontWeight: 900, fontSize: '0.9rem', padding: '0.3rem 0.75rem', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                                + {activeDemo.amount} ETB ☕
                            </span>
                        </div>

                        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.75rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: '#FFFFFF', fontStyle: 'italic', marginBottom: '0.85rem', borderLeft: '3px solid #34D399' }}>
                            "{activeDemo.note}"
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#A7F3D0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <CheckCircle size={14} color="#34D399" />
                                <span>Verified Telebirr PIN Push Settlement</span>
                            </div>
                            <button
                                type="button"
                                onClick={triggerTestAlert}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    color: '#FFFFFF',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Test Alert 🔔
                            </button>
                        </div>
                    </div>

                    {/* Live Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.65rem 0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>5,000+</div>
                            <div style={{ fontSize: '0.675rem', color: 'rgba(255,255,255,0.8)' }}>Active Creators</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.65rem 0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34D399' }}>99.9%</div>
                            <div style={{ fontSize: '0.675rem', color: 'rgba(255,255,255,0.8)' }}>Telebirr Uptime</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.65rem 0.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FBBF24' }}>&lt; 10s</div>
                            <div style={{ fontSize: '0.675rem', color: 'rgba(255,255,255,0.8)' }}>Instant Payouts</div>
                        </div>
                    </div>

                    {/* Trust Rails */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.18)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#FFFFFF' }}>
                            <CheckCircle size={14} color="#34D399" />
                            <span>Instant Telebirr Payouts</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#FFFFFF' }}>
                            <CheckCircle size={14} color="#34D399" />
                            <span>CBE, Abyssinia & Awash</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#FFFFFF' }}>
                            <CheckCircle size={14} color="#34D399" />
                            <span>1080p OBS Alert Overlays</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#FFFFFF' }}>
                            <CheckCircle size={14} color="#34D399" />
                            <span>Zero Monthly Fee</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
