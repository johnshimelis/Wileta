import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Phone, Lock, Eye, EyeOff, AlertCircle,
    ArrowLeft, Send, CheckCircle, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';

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
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

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
            setResendCountdown(60);
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
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 1rem',
            boxSizing: 'border-box'
        }}>
            {/* Top Bar with Language and Theme Controls */}
            <header style={{
                width: '100%',
                maxWidth: '480px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <LanguageToggle />
                <ThemeToggle />
            </header>

            {/* Main Centered Authentication Card */}
            <main style={{
                width: '100%',
                maxWidth: '440px',
                margin: 'auto 0'
            }}>
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '2.25rem 2rem',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)'
                }}>
                    {/* Centered Logo INSIDE the Modal */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <Logo size="medium" />
                    </div>

                    {showForgotPassword ? (
                        <div>
                            <button
                                onClick={() => { setShowForgotPassword(false); setError(''); setResetSent(false); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    marginBottom: '1rem',
                                    fontWeight: 600,
                                    fontSize: '0.85rem'
                                }}
                            >
                                <ArrowLeft size={16} /> Back to Sign In
                            </button>

                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.35rem' }}>
                                Reset Password
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                                Enter your registered email and we will send you a reset link.
                            </p>

                            {resetSent ? (
                                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <Mail size={22} />
                                    </div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Check Your Inbox</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                        Reset instructions sent to <strong>{resetEmail}</strong>.
                                    </p>
                                    <Button variant="primary" size="lg" className="btn-full" onClick={() => setShowForgotPassword(false)}>
                                        Return to Sign In
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword}>
                                    {error && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem' }}>
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
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
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
                                                    disabled={resendCountdown > 0}
                                                    style={{ flexShrink: 0 }}
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
                                    const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                        ? 'http://localhost:5000'
                                        : 'https://wileta-backend.onrender.com';
                                    window.location.href = `${backendUrl}/api/auth/google`;
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

                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
                    🔒 Secured by GurshaPay Financial Compliance • 🇪🇹 Ethiopia
                </div>
            </main>

            {/* Bottom Clean Footer */}
            <footer style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© {new Date().getFullYear()} GurshaPay Technologies Inc.</span>
            </footer>
        </div>
    );
}
