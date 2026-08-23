import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
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

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
    };

    const slideVariants = {
        enter: (direction) => {
            return {
                x: direction > 0 ? 100 : -100,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 100 : -100,
                opacity: 0
            };
        }
    };

    return (
        <motion.div 
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="auth-split-container"
        >
            <div className="auth-split-left">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <Logo size="medium" />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
                <div className="auth-split-form-wrapper">
                    <div className="auth-split-card">
            <div className="auth-card-inner">

                <AnimatePresence mode="wait" custom={showForgotPassword ? 1 : -1}>
                    {showForgotPassword ? (
                        <motion.div
                            key="forgot-password"
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        >
                            <button onClick={() => {setShowForgotPassword(false); setError(''); setResetSent(false);}} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600 }}>
                                <ArrowLeft size={16} /> Back to login
                            </button>
                            
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Reset Password</h1>
                            
                            {resetSent ? (
                                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                        <Mail size={32} color="var(--success)" />
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We've sent a password reset link to <strong>{resetEmail}</strong>. Please check your inbox.</p>
                                    <button onClick={() => setShowForgotPassword(false)} className="btn-primary" style={{ width: '100%' }}>Return to Login</button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword}>
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                                    
                                    {error && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500, marginBottom: '1rem' }}>
                                            <AlertCircle size={18} /> {error}
                                        </div>
                                    )}
                                    
                                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                        <Mail size={20} />
                                        <input
                                            type="email"
                                            placeholder={t('emailAddress')}
                                            value={resetEmail}
                                            onChange={e => { setResetEmail(e.target.value); setError(''); }}
                                            required
                                        />
                                    </div>
                                    <button type="submit" disabled={resetLoading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        {resetLoading ? <span className="spinner" style={{width: 20, height: 20}}></span> : (
                                            <><Send size={18} /> Send Reset Link</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login"
                            custom={-1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        >
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{t('welcomeBack')}</h1>
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.95rem', marginBottom: '1rem' }}>{t('signInSubtitle')}</p>

                            {/* Segmented Control Switcher */}
                            <div className="segmented-control" style={{ marginBottom: '1rem' }}>
                                <div 
                                    className="segmented-indicator"
                                    style={{
                                        left: loginMethod === 'email' ? '4px' : 'calc(50% + 2px)',
                                        width: 'calc(50% - 6px)'
                                    }}
                                />
                                {[{ id: 'email', label: t('emailMethod') }, { id: 'phone', label: t('phoneMethod') }].map(m => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => { setLoginMethod(m.id); setError(''); }}
                                        className={`segmented-btn ${loginMethod === m.id ? 'active' : ''}`}
                                        style={{ padding: '0.5rem 0', fontSize: '0.95rem' }}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: '0.75rem' }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                            <AlertCircle size={18} /> {error}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleLogin}>
                                <AnimatePresence mode="wait">
                                    {loginMethod === 'email' ? (
                                        <motion.div 
                                            key="email"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                                                <Mail size={20} />
                                                <input
                                                    type="email"
                                                    placeholder={t('emailAddress')}
                                                    value={email}
                                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
                                                <Lock size={20} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder={t('password')}
                                                    value={password}
                                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                                    required
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowForgotPassword(true)}
                                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: '0.2s', padding: 0 }}
                                                    onMouseOver={e => e.currentTarget.style.color = 'var(--primary-hover)'}
                                                    onMouseOut={e => e.currentTarget.style.color = 'var(--primary)'}
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="phone"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                                                <Phone size={20} />
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
                                                        background: otpSent ? 'var(--success)' : 'var(--primary)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.4rem 0.8rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        cursor: (sendingOtp || !phone) ? 'not-allowed' : 'pointer',
                                                        opacity: (sendingOtp || !phone) ? 0.7 : 1,
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {sendingOtp ? <span className="spinner" style={{width: 14, height: 14, borderWidth: 2}}></span> : (otpSent ? t('sent') : t('getOtp'))}
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                {otpSent && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        style={{ overflow: 'hidden' }}
                                                    >
                                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                                            <Lock size={20} />
                                                            <input
                                                                type="text"
                                                                placeholder={t('otpCode')}
                                                                value={otp}
                                                                onChange={e => { setOtp(e.target.value); setError(''); }}
                                                                maxLength={6}
                                                                required
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '0.5rem' }}>
                                                {!otpSent ? t('otpPromptClick') : t('otpPromptSent')}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {(loginMethod === 'email' || (loginMethod === 'phone' && otpSent)) && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary"
                                            style={{ marginTop: '0.5rem' }}
                                        >
                                            {loading ? <span className="spinner" style={{width: 20, height: 20}}></span> : t('signInButton')}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                                <span style={{ padding: '0 1rem' }}>{t('orSignInWith')}</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
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
                                        padding: '0.875rem',
                                        borderRadius: '1rem',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-main)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
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
                                    Continue with Google
                                </button>
                            </div>

                            <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                {t('dontHaveAccount')}{' '}
                                <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('signUpLink')}</Link>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
                    </div>
                </div>
            </div>
            <div className="auth-split-right">
                <div className="auth-split-pattern"></div>
                <div className="auth-split-content">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>Receive Tips & Support from Ethiopia and Beyond</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', lineHeight: 1.6 }}>Wileta makes it incredibly simple for creators, developers, and professionals to get paid directly to their local Ethiopian bank accounts.</p>
                    
                    <div className="auth-feature">
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Mail size={24} color="#10B981" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Instant Notifications</h4>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Get alerts via SMS and Email the moment you receive a tip.</p>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                            <Phone size={24} color="#3B82F6" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Telebirr Integration</h4>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Seamless direct charge payments right from users' phones.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
