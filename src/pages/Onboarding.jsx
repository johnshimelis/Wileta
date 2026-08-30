import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Sparkles, Smartphone, Check, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';

export default function Onboarding() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [telebirrInfo, setTelebirrInfo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { onboard } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleOnboard = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await onboard(name, username, telebirrInfo);

        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error || 'Failed to complete profile setup');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 1.25rem', boxSizing: 'border-box' }}>
            {/* Top Bar with Language & Theme Controls */}
            <div style={{ width: '100%', maxWidth: '460px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {/* Centered Modal Card */}
            <div style={{
                width: '100%',
                maxWidth: '460px',
                margin: 'auto 0',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
                boxSizing: 'border-box'
            }}>
                {/* Logo INSIDE Card */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Logo size="large" />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        {t('onboardingTitle')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {t('onboardingDesc2')}
                    </p>
                </div>

                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleOnboard}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">{t('fullName')}</label>
                        <div className="input-group">
                            <User size={18} />
                            <input
                                type="text"
                                className="form-input"
                                placeholder={t('fullNamePlaceholder') || 'e.g. Hana Tadesse'}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">{t('chooseUsernameLabel')}</label>
                        <div className="input-group">
                            <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>@</span>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="yourname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                            {t('yourTipLink')}: gurshapay.com/@{username || 'yourname'}
                        </p>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                        <label className="form-label">{t('yourTelebirrNumber')}</label>
                        <div className="input-group">
                            <span style={{ position: 'absolute', left: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span>🇪🇹</span> +251
                            </span>
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="911000000"
                                value={telebirrInfo}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/[^0-9]/g, '');
                                    if (val.startsWith('0')) val = val.substring(1);
                                    setTelebirrInfo(val.slice(0, 9));
                                }}
                                maxLength={9}
                                style={{ paddingLeft: '5.5rem' }}
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
                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? <span className="spinner"></span> : t('completeSetup')}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🔒 Secured by GurshaPay Financial Compliance • 🇪🇹 Ethiopia
            </div>
        </div>
    );
}
