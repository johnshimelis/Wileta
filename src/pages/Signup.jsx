import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

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
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.35rem' }}>{t('createAccount')}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>{t('signUpSubtitle')}</p>

                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
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
                                        placeholder="Abebe Kebede"
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
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="btn-full"
                                loading={loading}
                                style={{ marginTop: '0.5rem' }}
                            >
                                {t('signUpLink')}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('orSignUpWith')}</span>
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
                            {t('alreadyHaveAccount')}{' '}
                            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                {t('signInLink')}
                            </Link>
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                </div>
            </div>

            {/* Right Brand Area */}
            <div className="auth-split-right">
                <div style={{ maxWidth: '440px' }}>
                    <Badge variant="primary" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', marginBottom: '1.5rem' }}>
                        Start in 60 Seconds
                    </Badge>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>
                        Your Supporters Are Waiting.
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        Set up your customized tipping link, accept Telebirr contributions from fans, and withdraw your funds effortlessly.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.95rem' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>100% Free registration — zero monthly fee</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.95rem' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>Instant unique username (e.g. gurshapay.com/@you)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontSize: '0.95rem' }}>
                            <CheckCircle size={18} color="#34D399" />
                            <span>Full Telebirr & multi-bank payout support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
