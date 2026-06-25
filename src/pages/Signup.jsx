import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

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

        const res = await signup({ name, email, password });
        if (res.success) {
            navigate('/onboarding');
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

                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>{t('createAccount')}</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.75rem' }}>{t('signUpSubtitle')}</p>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <User size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                            type="text"
                            placeholder={t('fullName')}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Mail size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                            type="email"
                            placeholder={t('emailAddress')}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                            type="password"
                            placeholder={t('password')}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '1rem', borderRadius: '1rem' }}
                    >
                        {loading ? <span className="spinner"></span> : t('signUpLink')}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    <span style={{ padding: '0 0.75rem' }}>{t('orSignUpWith')}</span>
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
                    {t('alreadyHaveAccount')}{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('signInLink')}</Link>
                </p>

                <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem' }}>
                    <a href="/privacy.html" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{t('privacyPolicy')}</a>
                </div>
            </div>
        </div>
    );
}
