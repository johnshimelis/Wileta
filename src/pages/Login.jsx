import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Phone, Lock, Eye, EyeOff, AlertCircle,
    ArrowLeft, Send, Sparkles, CheckCircle, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Forgot Password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const { login, api, setUser } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const errParam = params.get('error');
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
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        }
        setSendingOtp(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (!resetEmail) {
            setError('Please enter your email to reset password');
            return;
        }
        setResetLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: resetEmail });
            setResetSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset link');
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
                setError(t('emailAndPassReq'));
                setLoading(false);
                return;
            }
            res = await login({ email, password });
        } else {
            if (!phone || !otp) {
                setError(t('phoneAndOtpReq'));
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
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-split-container">
            {/* Left Form Area */}
            <div className="auth-split-left">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <Logo size="small" />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>

                <div className="auth-split-card">
                    {showForgotPassword ? (
                        <div className="animate-fade-in">
                            <button
                                onClick={() => { setShowForgotPassword(false); setError(''); setResetSent(false); }}
                                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
                            >
                                <ArrowLeft size={16} /> Back to sign in
                            </button>

                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Reset Password</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                                Enter your registered email address and we'll send you a password reset link.
                            </p>

                            {resetSent ? (
                                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <Mail size={28} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Check Your Email</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        We sent a password reset link to <strong>{resetEmail}</strong>.
                                    </p>
                                    <Button variant="primary" className="btn-full" onClick={() => setShowForgotPassword(false)}>
                                        Return to Sign In
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword}>
                                    {error && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                                            <AlertCircle size={16} /> {error}
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label">{t('emailAddress')}</label>
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

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="btn-full"
                                        loading={resetLoading}
                                        icon={Send}
                                    >
                                        Send Reset Link
                                    </Button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.35rem' }}>{t('welcomeBack')}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{t('signInSubtitle')}</p>

                            {/* Method Switcher Tabs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', background: 'var(--card-bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('email'); setError(''); }}
                                    style={{
                                        padding: '0.5rem 0',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        background: loginMethod === 'email' ? 'var(--card-bg)' : 'transparent',
                                        color: loginMethod === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        boxShadow: loginMethod === 'email' ? 'var(--shadow-xs)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {t('emailMethod')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod('phone'); setError(''); }}
                                    style={{
                                        padding: '0.5rem 0',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        background: loginMethod === 'phone' ? 'var(--card-bg)' : 'transparent',
                                        color: loginMethod === 'phone' ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        boxShadow: loginMethod === 'phone' ? 'var(--shadow-xs)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {t('phoneMethod')}
                                </button>
                            </div>

                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
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
                                                    style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
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
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <div className="input-group" style={{ flex: 1 }}>
                                                    <Phone size={18} />
                                                    <input
                                                        type="tel"
                                                        className="form-input"
                                                        placeholder="0911000000"
                                                        value={phone}
                                                        onChange={e => setPhone(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="md"
                                                    onClick={handleSendOtp}
                                                    loading={sendingOtp}
                                                    disabled={otpSent}
                                                    style={{ flexShrink: 0 }}
                                                >
                                                    {otpSent ? t('sent') : t('getOtp')}
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

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="btn-full"
                                    loading={loading}
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    {t('signInButton')}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                                <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('orSignInWith')}</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            </div>

                            {/* Google OAuth Button */}
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                className="btn-full"
                                onClick={() => {
                                    const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                        ? 'http://localhost:5000'
                                        : 'https://wileta-backend.onrender.com';
                                    window.location.href = `${backendUrl}/api/auth/google`;
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                                </svg>
                                {t('googleButton')}
                            </Button>

                            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.75rem' }}>
                                {t('dontHaveAccount')}{' '}
                                <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                    {t('signUpLink')}
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    Secured by GurshaPay Financial Compliance • 🇪🇹 Ethiopia
                </div>
            </div>

            {/* Right Brand Showcase Area */}
            <div className="auth-split-right">
                <div style={{ maxWidth: '440px' }}>
                    <Badge variant="primary" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', marginBottom: '1.5rem' }}>
                        Creator Community
                    </Badge>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>
                        Receive Support. Grow Your Passion.
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        Over 5,000 Ethiopian creators use GurshaPay for instant Telebirr & bank payouts, livestream alerts, and fan engagement.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.95rem' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>Instant Telebirr PIN push confirmations</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.95rem' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>Direct bank transfers to CBE, Abyssinia, & Awash</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.95rem' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>Real-time OBS live stream overlays</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
