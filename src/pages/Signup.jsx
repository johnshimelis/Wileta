import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Lock, User, Eye, EyeOff,
    AlertCircle, CheckCircle2, ShieldCheck, Sparkles,
    Zap, DollarSign, TrendingUp, Users, ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import ComplianceBadge from '../components/ComplianceBadge';

export default function Signup() {
    const [name, setName] = useState(() => {
        try {
            const cached = JSON.parse(localStorage.getItem('gp_temp_signup') || '{}');
            return cached.name || '';
        } catch (_) { return ''; }
    });
    const [email, setEmail] = useState(() => {
        try {
            const cached = JSON.parse(localStorage.getItem('gp_temp_signup') || '{}');
            return cached.email || '';
        } catch (_) { return ''; }
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const authContext = useAuth() || {};
    const { setUser } = authContext;
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Check for Google OAuth callback token
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const errParam = params.get('error');

        if (token) {
            localStorage.setItem('token', token);
            setLoading(true);
            api.get('/auth/me')
                .then(res => {
                    if (typeof setUser === 'function') setUser(res.data);
                    localStorage.setItem('gp_cached_user', JSON.stringify(res.data));
                    if (res.data.isOnboarded) {
                        navigate('/dashboard');
                    } else {
                        navigate('/onboarding');
                    }
                })
                .catch(err => {
                    console.error('Google signup callback error:', err);
                    setError('Failed to sign up with Google account.');
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (errParam) {
            setError(decodeURIComponent(errParam));
        }
    }, [navigate, setUser]);

    // Bulletproof Signup execution with direct API fallback
    const executeSignup = async (payload) => {
        if (typeof authContext.signup === 'function') {
            return await authContext.signup(payload);
        }
        try {
            const res = await api.post('/auth/signup', payload);
            if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
            }
            if (res.data?.user) {
                localStorage.setItem('gp_cached_user', JSON.stringify(res.data.user));
                if (typeof setUser === 'function') setUser(res.data.user);
            }
            return { success: true, user: res.data?.user, token: res.data?.token };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Registration failed' };
        }
    };

    // Submit Registration (Step 1)
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match. Please re-enter your password.');
            return;
        }

        setLoading(true);

        try {
            const res = await executeSignup({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                confirmPassword
            });

            if (res && res.success) {
                localStorage.setItem('gp_temp_signup', JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase()
                }));
                navigate('/onboarding');
            } else {
                setError(res?.error || 'Registration failed. Please check your credentials.');
            }
        } catch (err) {
            setError(err?.response?.data?.error || 'Network error during signup. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    maxWidth: '460px',
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

                {/* Modal Card with Logo */}
                <div style={{
                    width: '100%',
                    maxWidth: '460px',
                    margin: 'auto 0',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '2.25rem 2rem',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
                        <Logo size="large" />
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            {t('createAccount')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {t('signUpSubtitle')}
                        </p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #EF4444',
                            color: '#EF4444',
                            borderRadius: '8px',
                            padding: '0.65rem 0.85rem',
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            marginBottom: '1rem'
                        }}>
                            <AlertCircle size={16} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid #10B981',
                            color: '#10B981',
                            borderRadius: '8px',
                            padding: '0.65rem 0.85rem',
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            marginBottom: '1rem'
                        }}>
                            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        {/* Full Name */}
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                {t('fullName')}
                            </label>
                            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}>
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Hana Tadesse"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        paddingLeft: '38px',
                                        paddingRight: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--input-bg, transparent)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                {t('emailAddress')}
                            </label>
                            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}>
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        paddingLeft: '38px',
                                        paddingRight: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--input-bg, transparent)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password with Show/Hide Toggle */}
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                {t('password')}
                            </label>
                            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}>
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        paddingLeft: '38px',
                                        paddingRight: '40px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--input-bg, transparent)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password with Show/Hide Toggle */}
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                Confirm Password
                            </label>
                            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}>
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        paddingLeft: '38px',
                                        paddingRight: '40px',
                                        borderRadius: '8px',
                                        border: confirmPassword && confirmPassword !== password 
                                            ? '1px solid #EF4444' 
                                            : '1px solid var(--border-color)',
                                        background: 'var(--input-bg, transparent)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword && confirmPassword !== password && (
                                <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                                    Passwords do not match
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || (confirmPassword && confirmPassword !== password)}
                            style={{
                                width: '100%',
                                height: '46px',
                                background: 'var(--primary)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '0.5rem',
                                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {loading ? <span className="spinner"></span> : 'Create Verified Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                        <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{t('orSignUpWith')}</span>
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
                        {t('alreadyHaveAccount')}{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                            {t('signInLink')}
                        </Link>
                    </p>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    By signing up, you agree to our Terms of Service & Privacy Policy.
                </div>

                <ComplianceBadge />
            </div>

            {/* Right Column: Clean Institutional Ethiopian Fintech Onboarding Guide (Desktop Only) */}
            <div className="desktop-only" style={{
                flex: 1.15,
                background: '#064E3B',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem 2.75rem',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '460px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {/* Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            background: 'rgba(255, 255, 255, 0.12)',
                            color: '#FFFFFF',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '9999px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>Join in 60 Seconds</span>
                        </span>
                    </div>

                    {/* Headline */}
                    <div>
                        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
                            Start receiving tips from your supporters today.
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.55 }}>
                            Create your personal tipping page, connect your Telebirr wallet or bank account, and get paid instantly in Ethiopian Birr.
                        </p>
                    </div>

                    {/* 4 Simple Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        {[
                            { num: '1', title: 'Claim Your Link', desc: 'Get your unique creator URL (gurshapay.com/@yourname) for your social bios.' },
                            { num: '2', title: 'Connect Payout Account', desc: 'Link your Telebirr number or CBE/Awash bank account for payouts.' },
                            { num: '3', title: 'Fans Tip Without App', desc: 'Your supporters can tip via Telebirr USSD, cards, or mobile banking without downloading an app.' },
                            { num: '4', title: 'Instant Withdrawals', desc: 'Transfer your funds directly to your wallet or bank whenever you want.' }
                        ].map((step, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.85rem',
                                padding: '0.85rem 1rem',
                                background: 'rgba(255, 255, 255, 0.06)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: '#10B981',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                }}>
                                    {step.num}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.15rem' }}>{step.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.4 }}>{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Highlights */}
                    <div style={{
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.85)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={15} color="#34D399" />
                            <span>Zero Registration Fee</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={15} color="#34D399" />
                            <span>Instant Settlement</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={15} color="#34D399" />
                            <span>Bank-Grade Security</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
