import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !email || !password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const res = await signup({ name, email, password });
        if (res.success) {
            navigate('/onboarding');
        } else {
            setError(res.error || 'Registration failed');
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
                padding: '2rem 1.5rem',
                minHeight: '100vh',
                boxSizing: 'border-box'
            }}>
                {/* Top Bar with Logo & Controls */}
                <div style={{
                    width: '100%',
                    maxWidth: '440px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Logo size="small" />
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>

                {/* Perfect Modal Card */}
                <div style={{
                    width: '100%',
                    maxWidth: '440px',
                    margin: 'auto 0',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '2.25rem 2rem',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                            {t('createAccount')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {t('signUpSubtitle')}
                        </p>
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        <div className="form-group">
                            <label className="form-label">{t('fullName')}</label>
                            <div className="input-group">
                                <User size={18} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Hana Tadesse"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="form-label">{t('password')}</label>
                            <div className="input-group">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                            {loading ? <span className="spinner"></span> : t('signUpLink')}
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
                        {t('alreadyHaveAccount')}{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                            {t('signInLink')}
                        </Link>
                    </p>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    By signing up, you agree to our Terms of Service & Privacy Policy.
                </div>
            </div>

            {/* Right Column: Centered Rich Interactive Showcase (Desktop) */}
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
                    <div style={{ marginBottom: '1.25rem' }}>
                        <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Sparkles size={14} color="#FBBF24" /> Start in 60 Seconds ⚡
                        </span>
                    </div>

                    <h2 style={{ fontSize: '2.15rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '0.85rem', letterSpacing: '-0.025em' }}>
                        Your Supporters Are Ready to Send Gursha.
                    </h2>
                    
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, marginBottom: '1.75rem' }}>
                        Create your unique public tipping page in seconds. Claim your handle and start receiving instant Telebirr tips directly from your audience.
                    </p>

                    {/* Feature Cards Checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)', marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#FFFFFF' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>100% Free registration — zero monthly fee</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#FFFFFF' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>Instant unique username (e.g. gurshapay.com/@you)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#FFFFFF' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>Full Telebirr & multi-bank payout support</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#A7F3D0' }}>
                        <ShieldCheck size={16} color="#34D399" />
                        <span>Protected by Ethiopian National ID KYC Verification</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
