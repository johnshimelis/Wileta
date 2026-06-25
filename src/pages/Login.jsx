import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

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

    const { login, api, setUser } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    React.useEffect(() => {
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
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top right, rgba(15, 157, 88, 0.08), transparent 500px), radial-gradient(circle at bottom left, rgba(66, 133, 244, 0.08), transparent 500px), var(--bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative'
        }}>
            {/* Top Right Actions */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="animate-slide-up" style={{
                width: '100%',
                maxWidth: '500px',
                background: 'var(--card-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.06), 0 0 0 1px var(--border-color)',
                padding: '2.5rem 3rem',
                transition: 'transform 0.3s, box-shadow 0.3s'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', justifyContent: 'center' }}>
                    <img src="/gurshapay-logo.png" alt="GurshaPay Logo" style={{ width: '44px', height: '44px', borderRadius: '1rem', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1 }}>{t('appName')}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', marginTop: '0.15rem' }}>ጎርሻፒይ</span>
                    </div>
                </div>

                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>{t('welcomeBack')}</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.75rem' }}>{t('signInSubtitle')}</p>

                {/* Method Switcher */}
                <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: '1rem', padding: '4px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                    {[{ id: 'email', label: t('emailMethod') }, { id: 'phone', label: t('phoneMethod') }].map(m => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => { setLoginMethod(m.id); setError(''); }}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: loginMethod === m.id ? 'var(--card-bg)' : 'transparent',
                                color: loginMethod === m.id ? 'var(--primary)' : 'var(--text-muted)',
                                boxShadow: loginMethod === m.id ? 'var(--shadow-sm)' : 'none',
                                fontFamily: 'inherit',
                            }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    {loginMethod === 'email' ? (
                        <>
                            <div className="input-group">
                                <Mail size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                <input
                                    type="email"
                                    placeholder={t('emailAddress')}
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <Lock size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('password')}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-group">
                                <Phone size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                <input
                                    type="tel"
                                    placeholder={t('phoneNumber')}
                                    value={phone}
                                    onChange={e => { setPhone(e.target.value); setError(''); setOtpSent(false); }}
                                    style={{ flex: 1, minWidth: 0 }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp || !phone}
                                    style={{
                                        background: otpSent ? '#059669' : 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        padding: '0.3rem 0.6rem',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: (sendingOtp || !phone) ? 'not-allowed' : 'pointer',
                                        opacity: (sendingOtp || !phone) ? 0.7 : 1,
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {sendingOtp ? '...' : (otpSent ? t('sent') : t('getOtp'))}
                                </button>
                            </div>
                            {otpSent && (
                                <div className="animate-fade-in delay-1 input-group">
                                    <Lock size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                                    <input
                                        type="text"
                                        placeholder={t('otpCode')}
                                        value={otp}
                                        onChange={e => { setOtp(e.target.value); setError(''); }}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            )}
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', marginTop: '-0.5rem' }}>
                                {!otpSent ? t('otpPromptClick') : t('otpPromptSent')}
                            </p>
                        </>
                    )}

                    {(loginMethod === 'email' || (loginMethod === 'phone' && otpSent)) && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.25rem', borderRadius: '1rem' }}
                        >
                            {loading ? <span className="spinner"></span> : t('signInButton')}
                        </button>
                    )}
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    <span style={{ padding: '0 0.75rem' }}>{t('orSignInWith')}</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                        type="button"
                        onClick={() => {
                            const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                ? 'http://localhost:5000'
                                : 'https://wileta-backend.onrender.com';
                            window.location.href = `${backendUrl}/api/auth/google`;
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border-color)',
                            background: 'var(--card-bg)',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        {t('googleButton')}
                    </button>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {t('dontHaveAccount')}{' '}
                    <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('signUpLink')}</Link>
                </p>

                <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem' }}>
                    <a href="/privacy.html" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{t('privacyPolicy')}</a>
                </div>
            </div>
        </div>
    );
}
